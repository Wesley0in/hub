'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { format, subMonths, isPast, isWithinInterval, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { STATUS_LABELS, PRIORITY_BG } from '@/lib/types'
import { cn } from '@/lib/utils'

const COLORS = {
  ideia: '#6366f1',
  planejamento: '#3b82f6',
  andamento: '#8b5cf6',
  pausado: '#eab308',
  concluido: '#22c55e',
}

const STATUS_COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#eab308', '#22c55e']

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#16161f] border border-white/8 rounded-2xl p-6">
      <h2 className="text-sm font-medium text-white/60 mb-5">{title}</h2>
      {children}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e1e2a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 shadow-xl">
      {label && <p className="font-medium text-white/90 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects)

  const metrics = useMemo(() => {
    const allTasks = projects.flatMap((p) => p.tasks ?? [])
    const doneTasks = allTasks.filter((t) => t.done)

    // By status
    const byStatus = Object.entries(STATUS_LABELS).map(([status, label]) => ({
      name: label,
      value: projects.filter((p) => p.status === status).length,
      status,
    })).filter((d) => d.value > 0)

    // Completed per month (last 6)
    const completedByMonth = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), 5 - i)
      const key = format(month, 'MMM', { locale: ptBR })
      const count = projects.filter((p) => {
        if (p.status !== 'concluido') return false
        const updated = new Date(p.updated_at)
        return format(updated, 'yyyy-MM') === format(month, 'yyyy-MM')
      }).length
      return { month: key, Concluídos: count }
    })

    // Category + type
    const catTypeData = [
      {
        name: 'Pessoal',
        App: projects.filter((p) => p.category === 'pessoal' && p.type === 'app').length,
        Automação: projects.filter((p) => p.category === 'pessoal' && p.type === 'automacao').length,
        Estudo: projects.filter((p) => p.category === 'pessoal' && p.type === 'estudo').length,
        Outro: projects.filter((p) => p.category === 'pessoal' && p.type === 'outro').length,
      },
      {
        name: 'Empresa',
        App: projects.filter((p) => p.category === 'empresa' && p.type === 'app').length,
        Automação: projects.filter((p) => p.category === 'empresa' && p.type === 'automacao').length,
        Estudo: projects.filter((p) => p.category === 'empresa' && p.type === 'estudo').length,
        Outro: projects.filter((p) => p.category === 'empresa' && p.type === 'outro').length,
      },
    ]

    // Upcoming / overdue
    const now = new Date()
    const deadlineProjects = projects
      .filter((p) => p.deadline && p.status !== 'concluido')
      .map((p) => {
        const date = new Date(p.deadline!)
        const isOverdue = isPast(date)
        const isSoon = !isOverdue && isWithinInterval(date, { start: now, end: addDays(now, 7) })
        return { ...p, isOverdue, isSoon, deadlineDate: date }
      })
      .filter((p) => p.isOverdue || p.isSoon)
      .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())

    return {
      totalProjects: projects.length,
      completedProjects: projects.filter((p) => p.status === 'concluido').length,
      totalTasks: allTasks.length,
      doneTasks: doneTasks.length,
      byStatus,
      completedByMonth,
      catTypeData,
      deadlineProjects,
    }
  }, [projects])

  const taskCompletion = metrics.totalTasks > 0
    ? Math.round((metrics.doneTasks / metrics.totalTasks) * 100)
    : 0

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Visão geral dos seus projetos</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Projetos', value: metrics.totalProjects, color: 'text-indigo-400' },
          { label: 'Projetos Concluídos', value: metrics.completedProjects, color: 'text-green-400' },
          { label: 'Total de Tarefas', value: metrics.totalTasks, color: 'text-blue-400' },
          { label: 'Taxa de Conclusão', value: `${taskCompletion}%`, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#16161f] border border-white/8 rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className={cn('text-3xl font-semibold', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status donut */}
        <SectionCard title="Distribuição por Status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.byStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {metrics.byStatus.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={COLORS[entry.status as keyof typeof COLORS] ?? STATUS_COLORS[index % STATUS_COLORS.length]}
                    opacity={0.9}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-white/60">{value}</span>}
                iconSize={8}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Completed per month */}
        <SectionCard title="Projetos Concluídos por Mês">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.completedByMonth} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="Concluídos" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Category + type */}
        <SectionCard title="Projetos por Categoria e Tipo">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.catTypeData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend formatter={(value) => <span className="text-xs text-white/60">{value}</span>} iconSize={8} />
              <Bar dataKey="App" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Automação" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Estudo" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Outro" fill="#64748b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Task completion */}
        <SectionCard title="Taxa de Conclusão de Tarefas">
          <div className="flex flex-col items-center justify-center h-[200px] gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                <circle
                  cx="64" cy="64" r="54" fill="none"
                  stroke="#22c55e" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - taskCompletion / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{taskCompletion}%</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-green-400" />{metrics.doneTasks} concluídas</span>
              <span className="flex items-center gap-1.5"><Clock size={13} className="text-white/30" />{metrics.totalTasks - metrics.doneTasks} pendentes</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Deadline alerts */}
      {metrics.deadlineProjects.length > 0 && (
        <SectionCard title="Prazos Próximos ou Vencidos">
          <div className="space-y-2">
            {metrics.deadlineProjects.map((p) => (
              <Link
                key={p.id}
                href={`/project/${p.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    size={14}
                    className={p.isOverdue ? 'text-red-400' : 'text-yellow-400'}
                  />
                  <div>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors">{p.name}</p>
                    <p className="text-xs text-white/40">
                      {p.isOverdue
                        ? `Vencido em ${format(p.deadlineDate, "dd 'de' MMM", { locale: ptBR })}`
                        : `Vence em ${format(p.deadlineDate, "dd 'de' MMM", { locale: ptBR })}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded border', PRIORITY_BG[p.priority])}>
                    {p.priority === 'alta' ? 'Alta' : p.priority === 'media' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}

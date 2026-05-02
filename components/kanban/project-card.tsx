'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Calendar, CheckSquare } from 'lucide-react'
import { formatDistanceToNow, isPast, isWithinInterval, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Project, CATEGORY_LABELS, TYPE_LABELS, PRIORITY_LABELS, PRIORITY_BG } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  overlay?: boolean
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const date = new Date(deadline)
  const now = new Date()
  const isOverdue = isPast(date)
  const isSoon = isWithinInterval(date, { start: now, end: addDays(now, 7) })

  const label = isOverdue
    ? `Vencido há ${formatDistanceToNow(date, { locale: ptBR })}`
    : `Vence em ${formatDistanceToNow(date, { locale: ptBR, addSuffix: false })}`

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs px-1.5 py-0.5 rounded',
        isOverdue
          ? 'bg-red-400/10 text-red-400'
          : isSoon
          ? 'bg-yellow-400/10 text-yellow-400'
          : 'bg-white/5 text-white/40'
      )}
    >
      <Calendar size={10} />
      {label}
    </span>
  )
}

export function ProjectCard({ project, overlay = false }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, data: { project } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const doneTasks = project.tasks?.filter((t) => t.done).length ?? 0
  const totalTasks = project.tasks?.length ?? 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-40'
      )}
    >
      <motion.div
        initial={overlay ? undefined : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-xl border border-white/8 bg-[#16161f] p-3.5 space-y-3',
          'hover:border-white/15 transition-colors',
          overlay && 'shadow-2xl shadow-black/40 rotate-1 border-indigo-500/30'
        )}
      >
        {/* Top badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {project.source === 'github' ? (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/60 border border-white/10">
              <Github size={9} />
              GitHub
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/50 border border-white/5">
              {CATEGORY_LABELS[project.category]}
            </span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/50 border border-white/5">
            {TYPE_LABELS[project.type]}
          </span>
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded border ml-auto', PRIORITY_BG[project.priority])}>
            {PRIORITY_LABELS[project.priority]}
          </span>
        </div>

        {/* Name */}
        <Link
          href={`/project/${project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block text-sm font-medium text-white/90 hover:text-white leading-snug line-clamp-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {project.name}
        </Link>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {totalTasks > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <CheckSquare size={11} />
                {doneTasks}/{totalTasks}
              </span>
            )}
            {project.github_url && (
              <span className="text-white/30">
                <Github size={12} />
              </span>
            )}
          </div>
          {project.deadline && <DeadlineBadge deadline={project.deadline} />}
        </div>
      </motion.div>
    </div>
  )
}

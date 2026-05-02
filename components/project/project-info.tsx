'use client'

import { useState } from 'react'
import { Save, X, Plus } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { Project, Category, ProjectType, Priority, Status, STATUS_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProjectInfoProps {
  project: Project
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  const { updateProject, addActivity } = useProjectStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: project.name,
    description: project.description ?? '',
    category: project.category,
    type: project.type,
    priority: project.priority,
    status: project.status,
    deadline: project.deadline ?? '',
    techInput: '',
    technologies: [...project.technologies],
  })

  const handleSave = () => {
    updateProject(project.id, {
      name: form.name,
      description: form.description || null,
      category: form.category as Category,
      type: form.type as ProjectType,
      priority: form.priority as Priority,
      status: form.status as Status,
      deadline: form.deadline || null,
      technologies: form.technologies,
    })
    addActivity(project.id, 'Edição salva', 'Informações gerais atualizadas')
    setEditing(false)
  }

  const addTech = () => {
    const t = form.techInput.trim()
    if (!t || form.technologies.includes(t)) return
    setForm({ ...form, technologies: [...form.technologies, t], techInput: '' })
  }

  const removeTech = (tech: string) => {
    setForm({ ...form, technologies: form.technologies.filter((t) => t !== tech) })
  }

  const labelClass = 'block text-xs text-white/40 mb-1'
  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors'

  if (!editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-white leading-tight">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-white/50 mt-1 leading-relaxed">{project.description}</p>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            Editar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/8">
            {project.category === 'pessoal' ? 'Pessoal' : 'Empresa'}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/8">
            {project.type === 'automacao' ? 'Automação' : project.type === 'app' ? 'App' : project.type === 'estudo' ? 'Estudo' : 'Outro'}
          </span>
          <span className={cn(
            'text-xs px-2 py-1 rounded border',
            project.priority === 'alta' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
            project.priority === 'media' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
            'bg-green-400/10 text-green-400 border-green-400/20'
          )}>
            {project.priority === 'alta' ? 'Alta' : project.priority === 'media' ? 'Média' : 'Baixa'}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {STATUS_LABELS[project.status]}
          </span>
          {project.deadline && (
            <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/8">
              Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-white/45 border border-white/8">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 border border-white/10 rounded-xl p-4 bg-white/2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/60">Editando informações</span>
        <button onClick={() => setEditing(false)} className="text-white/30 hover:text-white/60">
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className={labelClass}>Nome *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Descrição</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2} className={cn(inputClass, 'resize-none')} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={inputClass}>
              <option value="pessoal">Pessoal</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })} className={inputClass}>
              <option value="app">App</option>
              <option value="automacao">Automação</option>
              <option value="estudo">Estudo</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Prioridade</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className={inputClass}>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className={inputClass}>
              <option value="ideia">Ideia</option>
              <option value="planejamento">Em Planejamento</option>
              <option value="andamento">Em Andamento</option>
              <option value="pausado">Pausado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Prazo</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tecnologias</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.technologies.map((tech) => (
              <span key={tech} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/10">
                {tech}
                <button onClick={() => removeTech(tech)} className="text-white/30 hover:text-red-400"><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={form.techInput}
              onChange={(e) => setForm({ ...form, techInput: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              placeholder="Adicionar tecnologia..."
              className={cn(inputClass, 'flex-1')}
            />
            <button onClick={addTech} className="px-2 py-2 bg-white/5 border border-white/10 text-white/50 hover:text-white rounded-lg transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors font-medium">
          <Save size={13} />
          Salvar
        </button>
      </div>
    </div>
  )
}

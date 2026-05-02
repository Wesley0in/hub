'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Project, Status } from '@/lib/types'
import { ProjectCard } from './project-card'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: Status
  label: string
  projects: Project[]
}

const COLUMN_ACCENT: Record<Status, string> = {
  ideia: 'border-t-white/20',
  planejamento: 'border-t-blue-500/50',
  andamento: 'border-t-indigo-500/50',
  pausado: 'border-t-yellow-500/50',
  concluido: 'border-t-green-500/50',
}

const COLUMN_BADGE: Record<Status, string> = {
  ideia: 'bg-white/8 text-white/40',
  planejamento: 'bg-blue-500/10 text-blue-400',
  andamento: 'bg-indigo-500/10 text-indigo-400',
  pausado: 'bg-yellow-500/10 text-yellow-400',
  concluido: 'bg-green-500/10 text-green-400',
}

export function KanbanColumn({ id, label, projects }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col gap-3 min-w-[280px] w-[280px]">
      {/* Column header */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-medium text-white/70">{label}</span>
        <span className={cn('ml-auto text-xs px-1.5 py-0.5 rounded-full font-mono', COLUMN_BADGE[id])}>
          {projects.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2.5 rounded-xl border-t-2 bg-white/[0.02] p-3 min-h-[120px] transition-colors',
          COLUMN_ACCENT[id],
          isOver && 'bg-white/5'
        )}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SortableContext>

        {projects.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-white/20 select-none">
            Arraste um card aqui
          </div>
        )}
      </div>
    </div>
  )
}

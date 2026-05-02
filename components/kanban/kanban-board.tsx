'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { KANBAN_COLUMNS, Project, Status } from '@/lib/types'
import { KanbanColumn } from './kanban-column'
import { ProjectCard } from './project-card'
import { FiltersBar } from './filters-bar'
import { NewProjectModal } from './new-project-modal'
import { useGithubRepos } from '@/hooks/use-github-repos'

export function KanbanBoard() {
  const { projects, filters, moveProject } = useProjectStore()
  const { repos: githubRepos } = useGithubRepos()
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const allProjects = useMemo(() => {
    const existingUrls = new Set(projects.map((p) => p.github_url).filter(Boolean))
    const uniqueGithub = githubRepos.filter((r) => !existingUrls.has(r.github_url))
    return [...projects, ...uniqueGithub]
  }, [projects, githubRepos])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (filters.category && p.category !== filters.category) return false
      if (filters.type && p.type !== filters.type) return false
      if (filters.priority && p.priority !== filters.priority) return false
      if (filters.technology && !p.technologies.includes(filters.technology)) return false
      return true
    })
  }, [allProjects, filters])

  const handleDragStart = (event: DragStartEvent) => {
    const project = event.active.data.current?.project as Project
    setActiveProject(project ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveProject(null)

    if (!over) return
    const project = active.data.current?.project as Project
    if (!project) return

    // over.id could be a column id (Status) or another card id
    const columns = KANBAN_COLUMNS.map((c) => c.id)
    let targetStatus: Status | null = null

    if (columns.includes(over.id as Status)) {
      targetStatus = over.id as Status
    } else {
      // find which column the over-card belongs to
      const overProject = projects.find((p) => p.id === over.id)
      if (overProject) targetStatus = overProject.status
    }

    if (targetStatus && targetStatus !== project.status) {
      moveProject(project.id, targetStatus, project.status)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap px-6 pt-6">
        <FiltersBar />
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors font-medium shrink-0"
        >
          <Plus size={15} />
          Novo Projeto
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 px-6 pb-8 w-max min-w-full">
            {KANBAN_COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                label={col.label}
                projects={filteredProjects.filter((p) => p.status === col.id)}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeProject && <ProjectCard project={activeProject} overlay />}
          </DragOverlay>
        </DndContext>
      </div>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

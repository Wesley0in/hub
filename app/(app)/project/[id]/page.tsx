'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/lib/store'
import { ProjectInfo } from '@/components/project/project-info'
import { TaskChecklist } from '@/components/project/task-checklist'
import { NotesSection } from '@/components/project/notes-section'
import { IntegrationsSection } from '@/components/project/integrations-section'
import { ActivityLogSection } from '@/components/project/activity-log'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const projects = useProjectStore((s) => s.projects)
  const deleteProject = useProjectStore((s) => s.deleteProject)
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-white/40">Projeto não encontrado.</p>
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          Voltar ao Board
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm(`Excluir "${project.name}"? Esta ação não pode ser desfeita.`)) {
      deleteProject(project.id)
      router.push('/')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={13} />
          Voltar ao Board
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 border border-white/8 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={12} />
          Excluir projeto
        </button>
      </div>

      {/* Main layout: content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left: main content */}
        <div className="space-y-8">
          <div className="border border-white/8 rounded-2xl p-6 bg-[#16161f]">
            <ProjectInfo project={project} />
          </div>

          <div className="border border-white/8 rounded-2xl p-6 bg-[#16161f]">
            <TaskChecklist
              projectId={project.id}
              tasks={project.tasks ?? []}
            />
          </div>

          <div className="border border-white/8 rounded-2xl p-6 bg-[#16161f]">
            <NotesSection
              projectId={project.id}
              notes={project.notes ?? []}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
          <div className="border border-white/8 rounded-2xl p-6 bg-[#16161f]">
            <IntegrationsSection project={project} />
          </div>

          <div className="border border-white/8 rounded-2xl p-6 bg-[#16161f]">
            <ActivityLogSection logs={project.activity_log ?? []} />
          </div>
        </div>
      </div>
    </div>
  )
}

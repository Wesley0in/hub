'use client'

import { useState, useEffect } from 'react'
import { Github, ExternalLink, Star, GitCommit, Code, Loader2, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useProjectStore } from '@/lib/store'
import { Project, GitHubRepo } from '@/lib/types'

interface IntegrationsSectionProps {
  project: Project
}

function GitHubIntegration({ project }: { project: Project }) {
  const { updateProject, addActivity } = useProjectStore()
  const [url, setUrl] = useState(project.github_url ?? '')
  const [repo, setRepo] = useState<GitHubRepo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (project.github_url) {
      fetchRepo(project.github_url)
    }
  }, [project.github_url])

  const extractRepoPath = (input: string) => {
    try {
      const u = new URL(input)
      const parts = u.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
      if (parts.length >= 2) return `${parts[0]}/${parts[1]}`
    } catch {
      if (input.includes('/')) return input
    }
    return null
  }

  const fetchRepo = async (inputUrl: string) => {
    const path = extractRepoPath(inputUrl)
    if (!path) { setError('URL inválida'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://api.github.com/repos/${path}`)
      if (!res.ok) throw new Error('Repositório não encontrado')
      const data: GitHubRepo = await res.json()
      setRepo(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    updateProject(project.id, { github_url: url || null })
    addActivity(project.id, 'Edição salva', 'Integração GitHub atualizada')
    if (url) fetchRepo(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Github size={14} className="text-white/50" />
        <span className="text-xs font-medium text-white/60">GitHub</span>
      </div>
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={handleSave}
          placeholder="https://github.com/user/repo"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        {loading && <Loader2 size={16} className="text-white/40 animate-spin self-center" />}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {repo && (
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/80 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              {repo.full_name}
              <ExternalLink size={12} className="text-white/30" />
            </a>
          </div>
          {repo.description && <p className="text-xs text-white/45">{repo.description}</p>}
          <div className="flex items-center gap-4 text-xs text-white/40">
            {repo.language && (
              <span className="flex items-center gap-1"><Code size={11} />{repo.language}</span>
            )}
            <span className="flex items-center gap-1"><Star size={11} />{repo.stargazers_count.toLocaleString()}</span>
            <span className="flex items-center gap-1">
              <GitCommit size={11} />
              Último push {formatDistanceToNow(new Date(repo.pushed_at), { locale: ptBR, addSuffix: true })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function UrlIntegration({
  project,
  field,
  label,
  icon: Icon,
  placeholder,
}: {
  project: Project
  field: 'notion_url' | 'calendar_event_id'
  label: string
  icon: React.ElementType
  placeholder: string
}) {
  const { updateProject, addActivity } = useProjectStore()
  const [value, setValue] = useState((project[field] as string) ?? '')

  const handleBlur = () => {
    updateProject(project.id, { [field]: value || null })
    addActivity(project.id, 'Edição salva', `Integração ${label} atualizada`)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-white/50" />
        <span className="text-xs font-medium text-white/60">{label}</span>
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-white/5 border border-white/10 text-white/50 hover:text-white rounded-lg transition-colors flex items-center"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

export function IntegrationsSection({ project }: IntegrationsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-white/70">Integrações</h3>
      <GitHubIntegration project={project} />
      <div className="border-t border-white/5" />
      <UrlIntegration
        project={project}
        field="notion_url"
        label="Notion"
        icon={ExternalLink}
        placeholder="https://notion.so/..."
      />
      <div className="border-t border-white/5" />
      <UrlIntegration
        project={project}
        field="calendar_event_id"
        label="Google Calendar"
        icon={Calendar}
        placeholder="URL ou ID do evento"
      />
    </div>
  )
}

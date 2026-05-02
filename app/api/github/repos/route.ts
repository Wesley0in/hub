import { NextResponse } from 'next/server'
import type { Project, ProjectType, Status } from '@/lib/types'

function mapLanguageToType(language: string | null): ProjectType {
  if (!language) return 'outro'
  const l = language.toLowerCase()
  if (['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'swift', 'kotlin', 'dart', 'c#', 'c++', 'c', 'ruby', 'php'].includes(l)) return 'app'
  if (['shell', 'makefile', 'dockerfile', 'hcl'].includes(l)) return 'automacao'
  if (['jupyter notebook', 'r', 'matlab'].includes(l)) return 'estudo'
  return 'outro'
}

function mapTopicsToStatus(topics: string[]): Status {
  if (topics.includes('concluido') || topics.includes('done')) return 'concluido'
  if (topics.includes('pausado') || topics.includes('paused')) return 'pausado'
  if (topics.includes('planejamento') || topics.includes('planning')) return 'planejamento'
  if (topics.includes('ideia') || topics.includes('idea')) return 'ideia'
  return 'andamento'
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) {
    return NextResponse.json({ repos: [] })
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { tags: ['github-repos'] },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ repos: [], error: `GitHub API error: ${res.status}` }, { status: 200 })
  }

  const data = await res.json()

  const repos: Project[] = data.map((repo: any) => ({
    id: `gh_${repo.id}`,
    name: repo.name,
    description: repo.description ?? null,
    status: mapTopicsToStatus(repo.topics ?? []),
    category: 'pessoal' as const,
    type: mapLanguageToType(repo.language),
    priority: 'media' as const,
    deadline: null,
    github_url: repo.html_url,
    notion_url: null,
    calendar_event_id: null,
    technologies: repo.language ? [repo.language] : [],
    created_at: repo.created_at,
    updated_at: repo.pushed_at ?? repo.updated_at,
    user_id: username,
    tasks: [],
    notes: [],
    activity_log: [],
    source: 'github' as const,
  }))

  return NextResponse.json({ repos })
}

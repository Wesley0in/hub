'use client'

import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/types'

const POLL_INTERVAL = 60_000

export function useGithubRepos() {
  const [repos, setRepos] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const fetchRepos = async () => {
    try {
      const res = await fetch('/api/github/repos')
      if (!res.ok) {
        setError(`Erro HTTP ${res.status}`)
        return
      }
      const { repos: data, error: apiError } = await res.json()
      if (apiError) {
        setError(apiError)
        return
      }
      setError(null)
      setRepos(data ?? [])
    } catch (e: any) {
      setError(e.message ?? 'Erro ao buscar repositórios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
    intervalRef.current = setInterval(fetchRepos, POLL_INTERVAL)

    window.addEventListener('focus', fetchRepos)
    return () => {
      clearInterval(intervalRef.current)
      window.removeEventListener('focus', fetchRepos)
    }
  }, [])

  return { repos, loading, error }
}

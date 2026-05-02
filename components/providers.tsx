'use client'

import { useEffect } from 'react'
import { useProjectStore } from '@/lib/store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useProjectStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }, [theme])

  return <>{children}</>
}

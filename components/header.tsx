'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, LayoutDashboard, Kanban, LogOut, User } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useProjectStore()

  const navLinks = [
    { href: '/', label: 'Board', icon: Kanban },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/10 bg-[#0d0d14]/90 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            PH
          </div>
          <span className="text-sm tracking-wide">Hub de projetos</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname === href
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <User size={12} className="text-indigo-400" />
            </div>
            <span className="text-xs text-white/60">demo@projecthub.app</span>
          </div>
          <Link
            href="/login"
            className="p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={15} />
          </Link>
        </div>
      </div>
    </header>
  )
}

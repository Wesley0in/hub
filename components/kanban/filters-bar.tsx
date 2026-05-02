'use client'

import { X } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function FiltersBar() {
  const { filters, setFilters, clearFilters, projects } = useProjectStore()

  const allTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies))
  ).sort()

  const hasActiveFilters = Object.values(filters).some(Boolean)

  const selectClass = cn(
    'bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60',
    'focus:outline-none focus:border-indigo-500/50 transition-colors hover:border-white/20'
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-white/30 mr-1">Filtrar:</span>

      <select
        value={filters.category}
        onChange={(e) => setFilters({ category: e.target.value })}
        className={selectClass}
      >
        <option value="">Categoria</option>
        <option value="pessoal">Pessoal</option>
        <option value="empresa">Empresa</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters({ type: e.target.value })}
        className={selectClass}
      >
        <option value="">Tipo</option>
        <option value="app">App</option>
        <option value="automacao">Automação</option>
        <option value="estudo">Estudo</option>
        <option value="outro">Outro</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value })}
        className={selectClass}
      >
        <option value="">Prioridade</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>

      <select
        value={filters.technology}
        onChange={(e) => setFilters({ technology: e.target.value })}
        className={selectClass}
      >
        <option value="">Tecnologia</option>
        {allTechs.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={12} />
          Limpar
        </button>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { Category, ProjectType, Priority, Status } from '@/lib/types'
import { cn } from '@/lib/utils'

interface NewProjectModalProps {
  open: boolean
  onClose: () => void
}

export function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const addProject = useProjectStore((s) => s.addProject)
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'pessoal' as Category,
    type: 'app' as ProjectType,
    priority: 'media' as Priority,
    status: 'ideia' as Status,
    deadline: '',
    technologies: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addProject({
      name: form.name.trim(),
      description: form.description.trim() || null,
      status: form.status,
      category: form.category,
      type: form.type,
      priority: form.priority,
      deadline: form.deadline || null,
      github_url: null,
      notion_url: null,
      calendar_event_id: null,
      technologies: form.technologies
        ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    })
    setForm({
      name: '', description: '', category: 'pessoal', type: 'app',
      priority: 'media', status: 'ideia', deadline: '', technologies: '',
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-[#16161f] border border-white/10 rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <h2 className="text-sm font-semibold text-white">Novo Projeto</h2>
                <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Nome *</label>
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome do projeto"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descreva brevemente o projeto..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Categoria</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                    >
                      <option value="pessoal">Pessoal</option>
                      <option value="empresa">Empresa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Tipo</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                    >
                      <option value="app">App</option>
                      <option value="automacao">Automação</option>
                      <option value="estudo">Estudo</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Prioridade</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Média</option>
                      <option value="baixa">Baixa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Status inicial</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                    >
                      <option value="ideia">Ideia</option>
                      <option value="planejamento">Planejamento</option>
                      <option value="andamento">Em Andamento</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Prazo</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Tecnologias</label>
                    <input
                      value={form.technologies}
                      onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                      placeholder="React, Node.js, ..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors font-medium"
                  >
                    <Plus size={14} />
                    Criar Projeto
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

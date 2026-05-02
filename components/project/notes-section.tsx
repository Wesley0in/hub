'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useProjectStore } from '@/lib/store'
import { Note } from '@/lib/types'

interface NotesSectionProps {
  projectId: string
  notes: Note[]
}

export function NotesSection({ projectId, notes }: NotesSectionProps) {
  const { addNote, deleteNote } = useProjectStore()
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)

  const handleSave = () => {
    if (!content.trim()) return
    addNote(projectId, content.trim())
    setContent('')
    setPreview(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/70">Anotações</h3>

      {/* New note editor */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8 bg-white/3">
          <button
            onClick={() => setPreview(false)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${!preview ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Escrever
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${preview ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Preview
          </button>
          <span className="ml-auto text-[10px] text-white/25">Markdown suportado</span>
        </div>

        {preview ? (
          <div className="min-h-[100px] px-4 py-3 prose prose-invert prose-sm max-w-none text-white/70">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-white/25 text-sm">Nada para visualizar</p>
            )}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva uma anotação em Markdown..."
            rows={4}
            className="w-full bg-transparent px-4 py-3 text-sm text-white/80 placeholder:text-white/25 focus:outline-none resize-none"
          />
        )}

        <div className="flex justify-end px-3 py-2 border-t border-white/8 bg-white/3">
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors disabled:opacity-40 font-medium"
          >
            <Plus size={12} />
            Salvar Anotação
          </button>
        </div>
      </div>

      {/* Existing notes */}
      <div className="space-y-3">
        {[...notes].reverse().map((note) => (
          <div key={note.id} className="group border border-white/8 rounded-xl p-4 bg-white/2 hover:border-white/12 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs text-white/30">
                {formatDistanceToNow(new Date(note.created_at), { locale: ptBR, addSuffix: true })}
              </span>
              <button
                onClick={() => deleteNote(projectId, note.id)}
                className="text-white/0 group-hover:text-white/25 hover:!text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-white/65">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-xs text-white/25 text-center py-4">Nenhuma anotação ainda</p>
        )}
      </div>
    </div>
  )
}

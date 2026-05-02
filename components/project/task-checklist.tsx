'use client'

import { useState } from 'react'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, GripVertical, Check } from 'lucide-react'
import { useProjectStore } from '@/lib/store'
import { Task } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SortableTaskProps {
  task: Task
  projectId: string
}

function SortableTask({ task, projectId }: SortableTaskProps) {
  const { updateTask, deleteTask } = useProjectStore()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 group rounded-lg px-2 py-1.5 hover:bg-white/3 transition-colors',
        isDragging && 'opacity-40'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-white/15 hover:text-white/40 cursor-grab active:cursor-grabbing transition-colors shrink-0"
      >
        <GripVertical size={14} />
      </button>

      <button
        onClick={() => updateTask(projectId, task.id, { done: !task.done })}
        className={cn(
          'w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all',
          task.done
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-white/20 hover:border-white/40'
        )}
      >
        {task.done && <Check size={10} className="text-white" />}
      </button>

      <span className={cn('flex-1 text-sm', task.done ? 'line-through text-white/30' : 'text-white/80')}>
        {task.title}
      </span>

      <button
        onClick={() => deleteTask(projectId, task.id)}
        className="text-white/0 group-hover:text-white/30 hover:!text-red-400 transition-colors shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

interface TaskChecklistProps {
  projectId: string
  tasks: Task[]
}

export function TaskChecklist({ projectId, tasks }: TaskChecklistProps) {
  const { addTask, reorderTasks } = useProjectStore()
  const [newTitle, setNewTitle] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const done = tasks.filter((t) => t.done).length

  const handleAdd = () => {
    if (!newTitle.trim()) return
    addTask(projectId, newTitle.trim())
    setNewTitle('')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    const reordered = [...tasks]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    reorderTasks(projectId, reordered.map((t, i) => ({ ...t, position: i })))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/70">Checklist de Tarefas</h3>
        <span className="text-xs text-white/40 font-mono">{done}/{tasks.length}</span>
      </div>

      {tasks.length > 0 && (
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : '0%' }}
          />
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-0.5">
            {tasks.sort((a, b) => a.position - b.position).map((task) => (
              <SortableTask key={task.id} task={task} projectId={projectId} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {tasks.length === 0 && (
        <p className="text-xs text-white/25 text-center py-4">Nenhuma tarefa ainda</p>
      )}

      <div className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nova tarefa..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          className="px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-400 rounded-lg transition-colors disabled:opacity-40"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  )
}

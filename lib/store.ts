import { create } from 'zustand'
import { Project, Task, Note, ActivityLog, Status } from './types'
import { MOCK_PROJECTS } from './mock-data'

interface Filters {
  category: string
  type: string
  priority: string
  technology: string
}

interface ProjectStore {
  projects: Project[]
  filters: Filters
  theme: 'dark' | 'light'

  setFilters: (filters: Partial<Filters>) => void
  clearFilters: () => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void

  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'tasks' | 'notes' | 'activity_log'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  moveProject: (id: string, newStatus: Status, fromStatus: Status) => void

  addTask: (projectId: string, title: string) => void
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void
  deleteTask: (projectId: string, taskId: string) => void
  reorderTasks: (projectId: string, tasks: Task[]) => void

  addNote: (projectId: string, content: string) => void
  deleteNote: (projectId: string, noteId: string) => void

  addActivity: (projectId: string, action: string, detail?: string) => void
}

const generateId = () => Math.random().toString(36).slice(2, 11)

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: MOCK_PROJECTS,
  filters: { category: '', type: '', priority: '', technology: '' },
  theme: 'dark',

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  clearFilters: () =>
    set({ filters: { category: '', type: '', priority: '', technology: '' } }),

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'user1',
      tasks: [],
      notes: [],
      activity_log: [],
    }
    set((state) => ({ projects: [...state.projects, newProject] }))
    get().addActivity(newProject.id, 'Projeto criado', newProject.name)
    return newProject
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
      ),
    }))
  },

  deleteProject: (id) => {
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
  },

  moveProject: (id, newStatus, fromStatus) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p
      ),
    }))
    const labelMap: Record<string, string> = {
      ideia: 'Ideia',
      planejamento: 'Em Planejamento',
      andamento: 'Em Andamento',
      pausado: 'Pausado',
      concluido: 'Concluído',
    }
    get().addActivity(id, `Status alterado de ${labelMap[fromStatus]} para ${labelMap[newStatus]}`)
  },

  addTask: (projectId, title) => {
    const project = get().projects.find((p) => p.id === projectId)
    const position = (project?.tasks?.length ?? 0)
    const newTask: Task = {
      id: generateId(),
      project_id: projectId,
      title,
      done: false,
      position,
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, tasks: [...(p.tasks ?? []), newTask] } : p
      ),
    }))
  },

  updateTask: (projectId, taskId, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p
        const updatedTasks = (p.tasks ?? []).map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        )
        return { ...p, tasks: updatedTasks }
      }),
    }))
    if (updates.done === true) {
      const project = get().projects.find((p) => p.id === projectId)
      const task = project?.tasks?.find((t) => t.id === taskId)
      if (task) {
        get().addActivity(projectId, 'Tarefa concluída', task.title)
      }
    }
  },

  deleteTask: (projectId, taskId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: (p.tasks ?? []).filter((t) => t.id !== taskId) }
          : p
      ),
    }))
  },

  reorderTasks: (projectId, tasks) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, tasks } : p
      ),
    }))
  },

  addNote: (projectId, content) => {
    const newNote: Note = {
      id: generateId(),
      project_id: projectId,
      content,
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, notes: [...(p.notes ?? []), newNote] } : p
      ),
    }))
    get().addActivity(projectId, 'Nova anotação adicionada')
  },

  deleteNote: (projectId, noteId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, notes: (p.notes ?? []).filter((n) => n.id !== noteId) }
          : p
      ),
    }))
  },

  addActivity: (projectId, action, detail?) => {
    const newLog: ActivityLog = {
      id: generateId(),
      project_id: projectId,
      action,
      detail: detail ?? null,
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, activity_log: [newLog, ...(p.activity_log ?? [])] }
          : p
      ),
    }))
  },
}))

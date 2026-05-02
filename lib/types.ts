export type Status = 'ideia' | 'planejamento' | 'andamento' | 'pausado' | 'concluido'
export type Category = 'pessoal' | 'empresa'
export type ProjectType = 'automacao' | 'app' | 'estudo' | 'outro'
export type Priority = 'alta' | 'media' | 'baixa'

export interface Task {
  id: string
  project_id: string
  title: string
  done: boolean
  position: number
  created_at: string
}

export interface Note {
  id: string
  project_id: string
  content: string
  created_at: string
}

export interface ActivityLog {
  id: string
  project_id: string
  action: string
  detail: string | null
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: Status
  category: Category
  type: ProjectType
  priority: Priority
  deadline: string | null
  github_url: string | null
  notion_url: string | null
  calendar_event_id: string | null
  technologies: string[]
  created_at: string
  updated_at: string
  user_id: string
  tasks?: Task[]
  notes?: Note[]
  activity_log?: ActivityLog[]
}

export interface GitHubRepo {
  name: string
  full_name: string
  language: string | null
  stargazers_count: number
  pushed_at: string
  html_url: string
  description: string | null
}

export interface KanbanColumn {
  id: Status
  label: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'ideia', label: 'Ideia' },
  { id: 'planejamento', label: 'Em Planejamento' },
  { id: 'andamento', label: 'Em Andamento' },
  { id: 'pausado', label: 'Pausado' },
  { id: 'concluido', label: 'Concluído' },
]

export const STATUS_LABELS: Record<Status, string> = {
  ideia: 'Ideia',
  planejamento: 'Em Planejamento',
  andamento: 'Em Andamento',
  pausado: 'Pausado',
  concluido: 'Concluído',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  pessoal: 'Pessoal',
  empresa: 'Empresa',
}

export const TYPE_LABELS: Record<ProjectType, string> = {
  automacao: 'Automação',
  app: 'App',
  estudo: 'Estudo',
  outro: 'Outro',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  alta: 'text-red-400',
  media: 'text-yellow-400',
  baixa: 'text-green-400',
}

export const PRIORITY_BG: Record<Priority, string> = {
  alta: 'bg-red-400/10 text-red-400 border-red-400/20',
  media: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  baixa: 'bg-green-400/10 text-green-400 border-green-400/20',
}

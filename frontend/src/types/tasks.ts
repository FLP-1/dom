/**
 * @fileoverview Tipos para sistema de tarefas
 * @directory src/types
 * @description Definições de tipos para tarefas, responsáveis e estados
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export interface TaskResponsible {
  id: string
  name: string
  nickname: string
  role: 'empregado' | 'empregador' | 'familiar' | 'parceiro' | 'subordinado' | 'admin' | 'owner'
  avatar?: string
  email: string
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  responsibleId: string
  responsible?: TaskResponsible
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  completedAt?: Date
  photo?: string
  tags: string[]
  estimatedTime?: number // em minutos
  actualTime?: number // em minutos
  location?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export type TaskStatus = 
  | 'pending'    // Pendente
  | 'in_progress' // Em andamento
  | 'completed'  // Concluída
  | 'cancelled'  // Cancelada
  | 'paused'     // Pausada

export type TaskPriority = 
  | 'low'        // Baixa
  | 'medium'     // Média
  | 'high'       // Alta
  | 'urgent'     // Urgente

export interface TaskFilter {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  responsibleId?: string[]
  dueDate?: {
    from?: Date
    to?: Date
  }
  tags?: string[]
  search?: string
}

export interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  cancelled: number
  overdue: number
  completedToday: number
  averageCompletionTime: number
}

export interface TaskFormData {
  title: string
  description?: string
  responsibleId: string
  priority: TaskPriority
  dueDate?: Date
  tags: string[]
  estimatedTime?: number
  location?: string
  notes?: string
} 
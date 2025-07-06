/**
 * @fileoverview Testes do hook useTasks
 * @directory frontend/src/hooks/__tests__
 * @description Testes unitários para o hook de gerenciamento de tarefas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useTasks } from '../useTasks'
import { mockTask, mockApiResponse, mockApiError } from '@/utils/test-utils'

// Mock do fetch global
global.fetch = jest.fn()

// Mock do useMessageSnackbar
jest.mock('@/hooks/useMessageSnackbar', () => ({
  useMessageSnackbar: () => ({
    showMessage: jest.fn(),
  }),
}))

// Mock do next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key,
  }),
}))

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockClear()
  })

  const renderUseTasks = (profile = 'empregador') => {
    return renderHook(() => useTasks(profile, false))
  }

  describe('Estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const { result } = renderUseTasks()

      expect(result.current.tasks).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.stats).toEqual({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0,
      })
    })
  })

  describe('fetchTasks', () => {
    it('deve buscar tarefas com sucesso', async () => {
      const mockTasks = [mockTask]
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.tasks).toEqual(mockTasks)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.stats.total).toBe(1)
    })

    it('deve buscar tarefas com filtros', async () => {
      const mockTasks = [mockTask]
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      const filters = {
        status: 'pending',
        priority: 'high',
        assigned_to: '1',
        created_by: '1',
      }

      await act(async () => {
        await result.current.fetchTasks(filters)
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks?profile=empregador&status=pending&priority=high&assigned_to=1&created_by=1')
      )
    })

    it('deve lidar com erro na busca', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Erro ao buscar tarefas' }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.error).toBe('Erro ao buscar tarefas')
      expect(result.current.loading).toBe(false)
    })

    it('deve calcular estatísticas corretamente', async () => {
      const mockTasks = [
        { ...mockTask, id: '1', status: 'pending', dueDate: new Date('2024-12-25T00:00:00Z') },
        { ...mockTask, id: '2', status: 'in_progress', dueDate: new Date('2024-12-25T00:00:00Z') },
        { ...mockTask, id: '3', status: 'completed', dueDate: new Date('2024-12-25T00:00:00Z') },
        { ...mockTask, id: '4', status: 'pending', dueDate: new Date('2024-01-01T00:00:00Z') }, // Atrasada
      ]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.stats).toEqual({
        total: 4,
        pending: 2,
        in_progress: 1,
        completed: 1,
        overdue: 3, // Três tarefas atrasadas (todas com data passada)
      })
    })
  })

  describe('createTask', () => {
    it('deve criar tarefa com sucesso', async () => {
      const newTask = { ...mockTask, id: '2' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: newTask }),
      })

      const { result } = renderUseTasks()

      const taskData = {
        title: 'Nova tarefa',
        description: 'Descrição da tarefa',
        priority: 'high',
        assignedTo: '1',
      }

      await act(async () => {
        const created = await result.current.createTask(taskData)
        expect(created).toEqual(newTask)
      })

      expect(result.current.tasks).toContain(newTask)
      expect(result.current.stats.total).toBe(1)
      expect(result.current.stats.pending).toBe(1)
    })

    it('deve lidar com erro na criação', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Erro ao criar tarefa' }),
      })

      const { result } = renderUseTasks()

      const taskData = {
        title: 'Nova tarefa',
        description: 'Descrição da tarefa',
      }

      await act(async () => {
        try {
          await result.current.createTask(taskData)
        } catch (error) {
          expect(error.message).toBe('Erro ao criar tarefa')
        }
      })

      expect(result.current.error).toBe('Erro ao criar tarefa')
    })
  })

  describe('updateTask', () => {
    it('deve atualizar tarefa com sucesso', async () => {
      const updatedTask = { ...mockTask, title: 'Tarefa Atualizada' }
      
      // Primeiro, busca tarefas para inicializar o estado
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [mockTask] }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      // Depois, atualiza a tarefa
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: updatedTask }),
      })

      const updateData = {
        title: 'Tarefa Atualizada',
        description: 'Descrição atualizada',
      }

      await act(async () => {
        await result.current.updateTask('1', updateData)
      })

      expect(result.current.tasks[0].title).toBe('Tarefa Atualizada')
    })

    it('deve lidar com erro na atualização', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Erro ao atualizar tarefa' }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        try {
          await result.current.updateTask('1', { title: 'Atualizada' })
        } catch (error) {
          expect(error.message).toBe('Erro ao atualizar tarefa')
        }
      })

      expect(result.current.error).toBe('Erro ao atualizar tarefa')
    })
  })

  describe('deleteTask', () => {
    it('deve deletar tarefa com sucesso', async () => {
      // Primeiro, busca tarefas para inicializar o estado
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [mockTask, { ...mockTask, id: '2' }] }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      // Depois, deleta a tarefa
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await act(async () => {
        await result.current.deleteTask('1')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].id).toBe('2')
    })

    it('deve lidar com erro ao deletar', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Erro ao excluir tarefa' }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        try {
          await result.current.deleteTask('1')
        } catch (error) {
          expect(error.message).toBe('Erro ao excluir tarefa')
        }
      })

      expect(result.current.error).toBe('Erro ao excluir tarefa')
    })
  })

  describe('toggleTaskStatus', () => {
    it('deve alternar status da tarefa com sucesso', async () => {
      const updatedTask = { ...mockTask, status: 'completed' }
      
      // Primeiro, busca tarefas para inicializar o estado
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [mockTask] }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      // Depois, alterna o status
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: updatedTask }),
      })

      await act(async () => {
        await result.current.toggleTaskStatus('1', 'completed')
      })

      expect(result.current.tasks[0].status).toBe('completed')
    })

    it('deve lidar com erro ao alternar status', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Erro ao alterar status da tarefa' }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        try {
          await result.current.toggleTaskStatus('1', 'completed')
        } catch (error) {
          expect(error.message).toBe('Erro ao alterar status da tarefa')
        }
      })

      expect(result.current.error).toBe('Erro ao alterar status da tarefa')
    })
  })

  describe('getTaskById', () => {
    it('deve retornar tarefa por ID', async () => {
      const mockTasks = [
        { ...mockTask, id: '1' },
        { ...mockTask, id: '2', title: 'Tarefa 2' },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      const task = result.current.getTaskById('2')
      expect(task).toEqual({ ...mockTask, id: '2', title: 'Tarefa 2' })
    })

    it('deve retornar null para ID inexistente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [mockTask] }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      const task = result.current.getTaskById('999')
      expect(task).toBeNull()
    })
  })

  describe('filterTasks', () => {
    it('deve filtrar tarefas por status', async () => {
      const mockTasks = [
        { ...mockTask, id: '1', status: 'pending' },
        { ...mockTask, id: '2', status: 'completed' },
        { ...mockTask, id: '3', status: 'pending' },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      const filtered = result.current.filterTasks({ status: 'pending' })
      expect(filtered).toHaveLength(2)
      expect(filtered.every(task => task.status === 'pending')).toBe(true)
    })

    it('deve filtrar tarefas por prioridade', async () => {
      const mockTasks = [
        { ...mockTask, id: '1', priority: 'high' },
        { ...mockTask, id: '2', priority: 'low' },
        { ...mockTask, id: '3', priority: 'high' },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      const filtered = result.current.filterTasks({ priority: 'high' })
      expect(filtered).toHaveLength(2)
      expect(filtered.every(task => task.priority === 'high')).toBe(true)
    })

    it('deve filtrar tarefas por múltiplos critérios', async () => {
      const mockTasks = [
        { ...mockTask, id: '1', status: 'pending', priority: 'high' },
        { ...mockTask, id: '2', status: 'pending', priority: 'low' },
        { ...mockTask, id: '3', status: 'completed', priority: 'high' },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      const filtered = result.current.filterTasks({ status: 'pending', priority: 'high' })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('1')
    })
  })

  describe('Adaptação por perfil', () => {
    it('deve usar perfil correto nas requisições', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse([]),
      })

      const { result } = renderUseTasks('empregado')

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('profile=empregado')
      )
    })

    it('deve funcionar com diferentes perfis', () => {
      const profiles = ['empregador', 'empregado', 'familiar', 'parceiro', 'admin', 'owner']
      
      profiles.forEach(profile => {
        const { result } = renderUseTasks(profile)
        expect(result.current.tasks).toEqual([])
      })
    })
  })

  describe('Estados de loading', () => {
    it('deve mostrar loading durante operações', async () => {
      fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const { result } = renderUseTasks()

      act(() => {
        result.current.fetchTasks()
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('deve limpar loading após erro', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.loading).toBe(false)
    })
  })

  describe('Tratamento de erros', () => {
    it('deve capturar erros de rede', async () => {
      fetch.mockRejectedValueOnce(new Error('Erro de rede'))

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.error).toBe('Erro de rede')
    })

    it('deve limpar erro ao fazer nova operação', async () => {
      // Primeiro, gera um erro
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Erro ao buscar tarefas' }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.error).toBe('Erro ao buscar tarefas')

      // Depois, faz uma operação bem-sucedida
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      })

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('Cálculo de tarefas atrasadas', () => {
    it('deve identificar tarefas atrasadas corretamente', async () => {
      const mockTasks = [
        { ...mockTask, id: '1', status: 'pending', dueDate: new Date('2024-01-01T00:00:00Z') }, // Atrasada
        { ...mockTask, id: '2', status: 'pending', dueDate: new Date('2024-12-25T00:00:00Z') }, // No prazo
        { ...mockTask, id: '3', status: 'completed', dueDate: new Date('2024-01-01T00:00:00Z') }, // Concluída (não conta como atrasada)
      ]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.stats.overdue).toBe(2)
    })

    it('não deve contar tarefas concluídas como atrasadas', async () => {
      const mockTasks = [
        { ...mockTask, id: '1', status: 'completed', dueDate: new Date('2024-01-01T00:00:00Z') }, // Concluída
        { ...mockTask, id: '2', status: 'completed', dueDate: new Date('2024-12-25T00:00:00Z') }, // Concluída
      ]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      })

      const { result } = renderUseTasks()

      await act(async () => {
        await result.current.fetchTasks()
      })

      expect(result.current.stats.overdue).toBe(0)
    })
  })
}) 
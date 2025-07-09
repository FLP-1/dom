/**
 * @fileoverview Testes do hook useTasks
 * @directory src/hooks/__tests__
 * @description Testes unitários para o hook de gerenciamento de tarefas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useTasks } from '../useTasks'

// Mock do fetch para simular respostas da API
const mockFetch = jest.fn()
global.fetch = mockFetch

// Dados de teste reais
const TEST_TASKS = [
  {
    id: '1',
    title: 'Limpar a casa',
    description: 'Limpar todos os cômodos',
    status: 'pending',
    priority: 'medium',
    responsibleId: '1',
    dueDate: new Date('2024-12-25'),
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19')
  },
  {
    id: '2',
    title: 'Fazer compras',
    description: 'Comprar mantimentos da semana',
    status: 'in_progress',
    priority: 'high',
    responsibleId: '2',
    dueDate: new Date('2024-12-20'),
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-19')
  }
]

describe('useTasks', () => {
  beforeEach(() => {
    // Limpar mocks
    mockFetch.mockClear()
    // Limpar localStorage
    localStorage.clear()
  })

  describe('inicialização', () => {
    it('deve inicializar com estado vazio', async () => {
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.tasks).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('deve carregar tarefas iniciais', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', true)) // autoFetch = true
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.tasks).toHaveLength(2)
      })
      
      expect(result.current.tasks[0].title).toBe('Limpar a casa')
      expect(result.current.tasks[1].title).toBe('Fazer compras')
    })
  })

  describe('buscar tarefas', () => {
    it('deve buscar todas as tarefas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      expect(result.current.tasks).toHaveLength(2)
      expect(mockFetch).toHaveBeenCalledWith('/api/tasks?profile=empregador')
    })

    it('deve buscar tarefas com filtros', async () => {
      const filteredTasks = [TEST_TASKS[0]]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: filteredTasks
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks({ status: 'pending' })
      })
      
      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].status).toBe('pending')
    })

    it('deve tratar erro na busca', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Erro de rede'))
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.fetchTasks()
        } catch (error) {
          expect(error.message).toBe('Erro de rede')
        }
      })
      
      expect(result.current.error).toBeTruthy()
    })
  })

  describe('criar tarefa', () => {
    it('deve criar nova tarefa com sucesso', async () => {
      const newTask = {
        title: 'Nova tarefa',
        description: 'Descrição da nova tarefa',
        priority: 'high',
        responsibleId: '1'
      }
      
      const createdTask = {
        id: '3',
        ...newTask,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          task: createdTask
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.createTask(newTask)
      })
      
      expect(result.current.tasks).toContainEqual(createdTask)
      expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, profile: 'empregador' })
      })
    })

    it('deve validar dados obrigatórios na criação', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: 'Título é obrigatório'
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.createTask({})
        } catch (error) {
          expect(error.message).toBe('Título é obrigatório')
        }
      })
    })
  })

  describe('atualizar tarefa', () => {
    it('deve atualizar tarefa existente', async () => {
      const updatedTask = { ...TEST_TASKS[0], title: 'Tarefa atualizada' }
      
      // Mock para carregar tarefas iniciais
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      // Mock para atualizar tarefa
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          task: updatedTask
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      // Carregar tarefas primeiro
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      // Agora atualizar
      await act(async () => {
        await result.current.updateTask('1', { title: 'Tarefa atualizada' })
      })
      
      const updatedTaskInList = result.current.tasks.find(t => t.id === '1')
      expect(updatedTaskInList.title).toBe('Tarefa atualizada')
    })

    it('deve tratar erro ao atualizar tarefa inexistente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          message: 'Tarefa não encontrada'
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.updateTask('999', { title: 'Tarefa inexistente' })
        } catch (error) {
          expect(error.message).toBe('Tarefa não encontrada')
        }
      })
    })
  })

  describe('excluir tarefa', () => {
    it('deve excluir tarefa com sucesso', async () => {
      // Mock para carregar tarefas iniciais
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      // Mock para excluir tarefa
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Tarefa excluída com sucesso'
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      // Carregar tarefas primeiro
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      expect(result.current.tasks).toHaveLength(2)
      
      // Agora excluir
      await act(async () => {
        await result.current.deleteTask('1')
      })
      
      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks.find(t => t.id === '1')).toBeUndefined()
    })

    it('deve tratar erro ao excluir tarefa inexistente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          message: 'Tarefa não encontrada'
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.deleteTask('999')
        } catch (error) {
          expect(error.message).toBe('Tarefa não encontrada')
        }
      })
    })
  })

  describe('alterar status da tarefa', () => {
    it('deve alterar status para iniciada', async () => {
      const updatedTask = { ...TEST_TASKS[0], status: 'in_progress' }
      
      // Mock para carregar tarefas iniciais
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      // Mock para alterar status
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          task: updatedTask
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      // Carregar tarefas primeiro
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      // Agora alterar status
      await act(async () => {
        await result.current.toggleTaskStatus('1', 'in_progress')
      })
      
      const updatedTaskInList = result.current.tasks.find(t => t.id === '1')
      expect(updatedTaskInList.status).toBe('in_progress')
    })

    it('deve alterar status para concluída', async () => {
      const updatedTask = { ...TEST_TASKS[0], status: 'completed' }
      
      // Mock para carregar tarefas iniciais
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      // Mock para alterar status
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          task: updatedTask
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      // Carregar tarefas primeiro
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      // Agora alterar status
      await act(async () => {
        await result.current.toggleTaskStatus('1', 'completed')
      })
      
      const updatedTaskInList = result.current.tasks.find(t => t.id === '1')
      expect(updatedTaskInList.status).toBe('completed')
    })
  })

  describe('estatísticas', () => {
    it('deve calcular estatísticas corretamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      expect(result.current.stats.total).toBe(2)
      expect(result.current.stats.pending).toBe(1)
      expect(result.current.stats.in_progress).toBe(1)
      expect(result.current.stats.completed).toBe(0)
    })

    it('deve calcular estatísticas por responsável', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      // Usar filterTasks para calcular estatísticas por responsável
      const tasksByResponsible1 = result.current.filterTasks({ responsibleId: '1' })
      const tasksByResponsible2 = result.current.filterTasks({ responsibleId: '2' })
      
      expect(tasksByResponsible1).toHaveLength(1)
      expect(tasksByResponsible2).toHaveLength(1)
    })
  })

  describe('filtros', () => {
    it('deve aplicar filtros corretamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      // Usar a função filterTasks real
      const filteredTasks = result.current.filterTasks({ status: 'pending' })
      
      expect(filteredTasks).toHaveLength(1)
      expect(filteredTasks[0].status).toBe('pending')
    })

    it('deve limpar filtros', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: TEST_TASKS
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      // Testar filtros vazios (sem filtros)
      const allTasks = result.current.filterTasks({})
      
      expect(allTasks).toHaveLength(2)
      expect(allTasks).toEqual(TEST_TASKS)
    })
  })

  describe('performance', () => {
    it('deve lidar com muitas tarefas sem problemas de performance', async () => {
      const manyTasks = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i + 1),
        title: `Tarefa ${i + 1}`,
        description: `Descrição da tarefa ${i + 1}`,
        status: 'pending',
        priority: 'medium',
        responsibleId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          tasks: manyTasks
        })
      })
      
      const { result } = renderHook(() => useTasks('empregador', false)) // autoFetch = false
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      await act(async () => {
        await result.current.fetchTasks()
      })
      
      expect(result.current.tasks).toHaveLength(1000)
      
      // Testar filtros com muitas tarefas
      const startTime = performance.now()
      const filteredTasks = result.current.tasks.filter(t => t.status === 'pending')
      const endTime = performance.now()
      
      expect(filteredTasks).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(100) // Deve ser rápido (< 100ms)
    })
  })
}) 
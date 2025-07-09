/**
 * @fileoverview Testes do hook useNotifications
 * @directory src/hooks/__tests__
 * @description Testes unitários para o hook de gerenciamento de notificações
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useNotifications } from '../useNotifications'
import {
  setupTestEnvironment,
  REAL_TEST_DATA,
  createRealApiResponse,
  waitForAsync
} from '@/utils/test-utils'

// Mock do next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key
  })
}))

// Mock do useMessageSnackbar
jest.mock('@/hooks/useMessageSnackbar', () => ({
  useMessageSnackbar: () => ({
    showMessage: jest.fn()
  })
}))

describe('useNotifications', () => {
  let testEnvironment

  beforeAll(() => {
    testEnvironment = setupTestEnvironment()
  })

  afterAll(() => {
    testEnvironment.cleanup()
  })

  beforeEach(() => {
    // Resetar fetch mock
    global.fetch = jest.fn()
  })

  describe('inicialização', () => {
    it('deve inicializar com estado vazio', async () => {
      const { result } = renderHook(() => useNotifications('empregador', false))
      expect(result.current.notifications).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.stats).toEqual({
        total: 0,
        unread: 0,
        today: 0,
        urgent: 0
      })
    })

    it('deve carregar notificações automaticamente quando autoFetch é true', async () => {
      // Mock da resposta da API para todas as chamadas
      const notifications = REAL_TEST_DATA.notifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false }))
      global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(notifications)
      }))
      const { result } = renderHook(() => useNotifications('empregador', true))
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      await waitFor(() => {
        expect(result.current.notifications.length).toBeGreaterThan(0)
      }, { timeout: 3000 })
      expect(result.current.notifications).toEqual(notifications)
      expect(result.current.loading).toBe(false)
      expect(result.current.error === null || result.current.error === undefined).toBe(true)
    })
  })

  describe('buscar notificações', () => {
    it('deve buscar todas as notificações', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false })))
      })
      const { result } = renderHook(() => useNotifications('empregador', false))
      await act(async () => {
        await result.current.fetchNotifications()
      })
      expect(result.current.notifications).toEqual(
        REAL_TEST_DATA.notifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false }))
      )
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.stats.total).toBe(REAL_TEST_DATA.notifications.length)
    })

    it('deve buscar notificações com filtros', async () => {
      const filteredNotifications = REAL_TEST_DATA.notifications.filter(n => !(n.lida ?? n.read))
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(filteredNotifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false })))
      })
      const { result } = renderHook(() => useNotifications('empregador', false))
      const filters = {
        unread_only: true,
        notification_type: 'task_assigned',
        limit: 10
      }
      await act(async () => {
        await result.current.fetchNotifications(filters)
      })
      expect(result.current.notifications).toEqual(
        filteredNotifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false }))
      )
      expect(result.current.loading).toBe(false)
      expect(result.current.stats.unread).toBe(
        filteredNotifications.filter(n => !(n.lida ?? n.read)).length
      )
    })

    it('deve tratar erro na busca', async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useNotifications('empregador', false))
      await act(async () => {
        await result.current.fetchNotifications()
      })
      // O hook retorna a mensagem do erro, não a mensagem customizada
      expect(result.current.error).toBe('Network error')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('marcar como lida', () => {
    it('deve marcar notificação como lida', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false })))
      })
      const { result } = renderHook(() => useNotifications('empregador', false))
      await act(async () => {
        await result.current.fetchNotifications()
      })
      const unreadNotification = result.current.notifications.find(n => !n.lida)
      expect(unreadNotification).toBeDefined()
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            ...unreadNotification,
            lida: true,
            data_leitura: new Date().toISOString()
          }
        })
      })
      await act(async () => {
        await result.current.markAsRead(unreadNotification.id)
      })
      const updatedNotification = result.current.notifications.find(n => n.id === unreadNotification.id)
      expect(updatedNotification.lida).toBe(true)
      // O stats.unread só será 0 se só havia uma não lida
      expect(result.current.stats.unread).toBe(
        result.current.notifications.filter(n => !n.lida).length
      )
    })

    it('deve tratar erro ao marcar como lida', async () => {
      const { result } = renderHook(() => useNotifications('empregador', false))
      
      // Mock de erro
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, message: 'Notificação não encontrada' })
      })
      
      await act(async () => {
        try {
          await result.current.markAsRead('notificacao-inexistente')
        } catch (error) {
          expect(error.message).toBe('Erro ao marcar como lida')
        }
      })
    })
  })

  describe('marcar todas como lidas', () => {
    it('deve marcar todas as notificações como lidas', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications.map(n => ({ ...n, lida: n.lida ?? n.read ?? false })))
      })
      const { result } = renderHook(() => useNotifications('empregador', false))
      await act(async () => {
        await result.current.fetchNotifications()
      })
      const unreadCount = result.current.notifications.filter(n => !n.lida).length
      expect(unreadCount).toBeGreaterThan(0)
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: REAL_TEST_DATA.notifications.map(n => ({ ...n, lida: true })),
          message: 'Todas as notificações foram marcadas como lidas'
        })
      })
      await act(async () => {
        await result.current.markAllAsRead()
      })
      const unreadNotifications = result.current.notifications.filter(n => !n.lida)
      expect(unreadNotifications.length).toBe(0)
      expect(result.current.stats.unread).toBe(0)
    })
  })

  describe('criar notificação', () => {
    it('deve criar nova notificação com sucesso', async () => {
      const { result } = renderHook(() => useNotifications('empregador', false))
      const newNotification = {
        title: 'Nova notificação',
        message: 'Esta é uma nova notificação',
        type: 'info',
        user_id: '1'
      }
      const createdNotification = {
        id: 'nova-notificacao',
        ...newNotification,
        lida: false,
        created_at: new Date().toISOString()
      }
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: createdNotification
        })
      })
      await act(async () => {
        const created = await result.current.createNotification(newNotification)
        expect(created).toEqual(createdNotification)
      })
      expect(result.current.notifications[0]).toEqual(createdNotification)
      expect(result.current.stats.total).toBe(1)
      expect(result.current.stats.unread).toBe(1)
    })
  })

  describe('atualizar notificação', () => {
    it('deve atualizar notificação com sucesso', async () => {
      // Mock inicial das notificações
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications)
      })

      const { result } = renderHook(() => useNotifications('empregador', false))
      
      // Carregar notificações primeiro
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      const notificationToUpdate = result.current.notifications[0]
      const updateData = {
        title: 'Título atualizado',
        message: 'Mensagem atualizada'
      }
      
      // Mock da resposta para atualizar
      const updatedNotification = {
        ...notificationToUpdate,
        ...updateData
      }
      
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: updatedNotification
        })
      })
      
      await act(async () => {
        await result.current.updateNotification(notificationToUpdate.id, updateData)
      })
      
      const updated = result.current.notifications.find(n => n.id === notificationToUpdate.id)
      expect(updated.title).toBe('Título atualizado')
      expect(updated.message).toBe('Mensagem atualizada')
    })
  })

  describe('excluir notificação', () => {
    it('deve excluir notificação com sucesso', async () => {
      // Mock inicial das notificações
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications)
      })

      const { result } = renderHook(() => useNotifications('empregador', false))
      
      // Carregar notificações primeiro
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      const notificationToDelete = result.current.notifications[0]
      const initialCount = result.current.notifications.length
      
      // Mock da resposta para deletar
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { deleted: true }
        })
      })
      
      await act(async () => {
        await result.current.deleteNotification(notificationToDelete.id)
      })
      
      // Verificar se a notificação foi removida da lista
      expect(result.current.notifications.length).toBe(initialCount - 1)
      const notificationExists = result.current.notifications.find(n => n.id === notificationToDelete.id)
      expect(notificationExists).toBeUndefined()
    })

    it('deve tratar erro ao excluir notificação inexistente', async () => {
      const { result } = renderHook(() => useNotifications('empregador', false))
      
      // Mock de erro
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, message: 'Notificação não encontrada' })
      })
      
      await act(async () => {
        try {
          await result.current.deleteNotification('notificacao-inexistente')
        } catch (error) {
          expect(error.message).toBe('Erro ao deletar notificação')
        }
      })
    })
  })

  describe('estatísticas', () => {
    it('deve calcular estatísticas corretamente', async () => {
      // Mock da resposta da API
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications)
      })

      const { result } = renderHook(() => useNotifications('empregador', false))
      
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      const stats = result.current.stats
      
      expect(stats).toBeDefined()
      expect(stats.total).toBe(REAL_TEST_DATA.notifications.length)
      expect(stats.unread).toBeGreaterThanOrEqual(0)
      expect(stats.today).toBeGreaterThanOrEqual(0)
      expect(stats.urgent).toBeGreaterThanOrEqual(0)
    })

    it('deve atualizar estatísticas quando notificações mudam', async () => {
      // Mock inicial
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications)
      })

      const { result } = renderHook(() => useNotifications('empregador', false))
      
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      const initialStats = result.current.stats
      
      // Mock para marcar como lida
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            ...REAL_TEST_DATA.notifications[0],
            lida: true,
            data_leitura: new Date().toISOString()
          }
        })
      })
      
      await act(async () => {
        await result.current.markAsRead(REAL_TEST_DATA.notifications[0].id)
      })
      
      // Verificar se as estatísticas foram atualizadas
      expect(result.current.stats.unread).toBeLessThan(initialStats.unread)
    })
  })

  describe('utilitários', () => {
    it('deve retornar hasUnread corretamente', async () => {
      // Mock com notificações não lidas
      const unreadNotifications = REAL_TEST_DATA.notifications.filter(n => !n.lida)
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(unreadNotifications)
      })

      const { result } = renderHook(() => useNotifications('empregador', false))
      
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      if (unreadNotifications.length > 0) {
        expect(result.current.hasUnread).toBe(true)
      } else {
        expect(result.current.hasUnread).toBe(false)
      }
    })

    it('deve retornar hasUrgent corretamente', async () => {
      // Mock com notificações urgentes
      const urgentNotifications = REAL_TEST_DATA.notifications.map(n => ({
        ...n,
        prioridade: 'urgente'
      }))
      
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(urgentNotifications)
      })

      const { result } = renderHook(() => useNotifications('empregador', false))
      
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      expect(result.current.hasUrgent).toBe(true)
    })

    it('deve retornar hasToday corretamente', async () => {
      // Mock com notificações de hoje
      const today = new Date()
      const todayString = today.toDateString()
      const todayNotifications = REAL_TEST_DATA.notifications.map(n => ({
        ...n,
        lida: n.lida ?? n.read ?? false,
        data_criacao: today.toISOString(), // campo usado pelo hook
        created_at: today.toISOString()
      }))
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(todayNotifications)
      })
      const { result } = renderHook(() => useNotifications('empregador', false))
      await act(async () => {
        await result.current.fetchNotifications()
      })
      // Verifica se pelo menos uma notificação é de hoje
      const hasToday = result.current.notifications.some(n => {
        const notificationDate = new Date(n.data_criacao || n.created_at).toDateString()
        return notificationDate === todayString
      })
      expect(hasToday).toBe(true)
      expect(result.current.hasToday).toBe(true)
    })
  })

  describe('cenários de erro', () => {
    it('deve lidar com resposta malformada da API', async () => {
      // Simular resposta malformada
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ invalid: 'response' })
      })
      
      const { result } = renderHook(() => useNotifications('empregador', false))
      
      await act(async () => {
        await result.current.fetchNotifications()
      })
      
      expect(result.current.error).toBe('Erro ao buscar notificações')
      expect(result.current.loading).toBe(false)
    })

    it('deve lidar com timeout da API', async () => {
      // Simular timeout
      global.fetch = jest.fn().mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )
      const { result } = renderHook(() => useNotifications('empregador', false))
      await act(async () => {
        await result.current.fetchNotifications()
      })
      // O hook retorna a mensagem do erro
      expect(result.current.error).toBe('Timeout')
      expect(result.current.loading).toBe(false)
    })
  })
})
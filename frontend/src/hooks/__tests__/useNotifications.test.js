/**
 * @fileoverview Testes do hook useNotifications
 * @directory frontend/src/hooks/__tests__
 * @description Testes unitários para o hook de gerenciamento de notificações
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useNotifications } from '../useNotifications'
import { mockNotification, mockApiResponse, mockApiError } from '@/utils/test-utils'

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

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockClear()
  })

  const renderUseNotifications = (profile = 'empregador', autoFetch = false) => {
    return renderHook(() => useNotifications(profile, autoFetch))
  }

  describe('Estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const { result } = renderUseNotifications('empregador', false)
      expect(result.current.notifications).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.stats).toEqual({
        total: 0,
        unread: 0,
        today: 0,
        urgent: 0,
      })
    })
  })

  describe('fetchNotifications', () => {
    it('deve buscar notificações com sucesso', async () => {
      const mockNotifications = [mockNotification]
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ 
          success: true, 
          data: mockNotifications,
          message: 'Notificações carregadas com sucesso'
        }),
        text: async () => 'Success',
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      await waitFor(() => {
        expect(result.current.notifications).toEqual(mockNotifications)
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
        expect(result.current.stats.total).toBe(1)
      })
    })

    it('deve buscar notificações com filtros', async () => {
      const mockNotifications = [mockNotification]
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: mockNotifications,
          message: 'Notificações carregadas com sucesso'
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      const filters = {
        limit: 10,
        offset: 0,
        unread_only: true,
        notification_type: 'task',
      }

      await act(async () => {
        await result.current.fetchNotifications(filters)
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/notifications?limit=10&offset=0&unread_only=true&notification_type=task&profile=empregador')
      )
    })

    it('deve lidar com erro na busca', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(result.current.error).toBe('Erro ao buscar notificações')
      expect(result.current.loading).toBe(false)
    })

    it('deve lidar com resposta de erro da API', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          message: 'Erro interno do servidor',
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(result.current.error).toBe('Erro interno do servidor')
    })

    it('deve calcular estatísticas corretamente', async () => {
      const mockNotifications = [
        { ...mockNotification, id: '1', lida: false, prioridade: 'urgente', data_criacao: new Date().toISOString() },
        { ...mockNotification, id: '2', lida: true, prioridade: 'normal', data_criacao: new Date().toISOString() },
        { ...mockNotification, id: '3', lida: false, prioridade: 'urgente', data_criacao: new Date().toISOString() },
      ]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: mockNotifications,
          message: 'Notificações carregadas com sucesso'
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(result.current.stats).toEqual({
        total: 3,
        unread: 2,
        today: 3, // Todas criadas hoje no mock
        urgent: 2,
      })
    })
  })

  describe('createNotification', () => {
    it('deve criar notificação com sucesso', async () => {
      const newNotification = { ...mockNotification, id: '2' }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: newNotification,
          message: 'Notificação criada com sucesso'
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      const notificationData = {
        title: 'Nova notificação',
        message: 'Teste de criação',
        type: 'info',
      }

      await act(async () => {
        const created = await result.current.createNotification(notificationData)
        expect(created).toEqual(newNotification)
      })

      expect(result.current.notifications).toContain(newNotification)
      expect(result.current.stats.total).toBe(1)
      expect(result.current.stats.unread).toBe(1)
    })

    it('deve lidar com erro na criação', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      const { result } = renderUseNotifications('empregador', false)

      const notificationData = {
        title: 'Nova notificação',
        message: 'Teste de criação',
      }

      await act(async () => {
        try {
          await result.current.createNotification(notificationData)
        } catch (error) {
          expect(error.message).toBe('Erro ao criar notificação')
        }
      })

      expect(result.current.error).toBe('Erro ao criar notificação')
    })
  })

  describe('markAsRead', () => {
    it('deve marcar notificação como lida com sucesso', async () => {
      const updatedNotification = { ...mockNotification, lida: true }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: updatedNotification,
          message: 'Notificação marcada como lida'
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        const response = await result.current.markAsRead('1')
        expect(response).toEqual(updatedNotification)
      })
    })

    it('deve lidar com erro ao marcar como lida', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        try {
          await result.current.markAsRead('1')
        } catch (error) {
          expect(error.message).toBe('Erro ao marcar como lida')
        }
      })

      expect(result.current.error).toBe('Erro ao marcar como lida')
    })
  })

  describe('markAllAsRead', () => {
    it('deve marcar todas as notificações como lidas', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: { message: 'Todas as notificações marcadas como lidas' },
          message: 'Todas as notificações marcadas como lidas'
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        const response = await result.current.markAllAsRead()
        expect(response).toEqual({ message: 'Todas as notificações marcadas como lidas' })
      })
    })

    it('deve lidar com erro ao marcar todas como lidas', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        try {
          await result.current.markAllAsRead()
        } catch (error) {
          expect(error.message).toBe('Erro ao marcar todas como lidas')
        }
      })

      expect(result.current.error).toBe('Erro ao marcar todas como lidas')
    })
  })

  describe('deleteNotification', () => {
    it('deve deletar notificação com sucesso', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: { message: 'Notificação deletada com sucesso' },
          message: 'Notificação deletada com sucesso'
        }),
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        const response = await result.current.deleteNotification('1')
        expect(response).toBe(true)
      })
    })

    it('deve lidar com erro ao deletar', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        try {
          await result.current.deleteNotification('1')
        } catch (error) {
          expect(error.message).toBe('Erro ao deletar notificação')
        }
      })

      expect(result.current.error).toBe('Erro ao deletar notificação')
    })
  })

  describe('Adaptação por perfil', () => {
    it('deve usar perfil correto nas requisições', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: [],
          message: 'Notificações carregadas com sucesso'
        }),
      })

      const { result } = renderUseNotifications('empregado', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('profile=empregado')
      )
    })

    it('deve funcionar com diferentes perfis', () => {
      const profiles = ['empregador', 'empregado', 'familiar', 'parceiro', 'admin', 'owner']
      
      profiles.forEach(profile => {
        const { result } = renderUseNotifications(profile, false)
        expect(result.current.notifications).toEqual([])
      })
    })
  })

  describe('Estados de loading', () => {
    it('deve mostrar loading durante operações', async () => {
      fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const { result } = renderUseNotifications('empregador', false)

      act(() => {
        result.current.fetchNotifications()
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

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(result.current.loading).toBe(false)
    })
  })

  describe('Tratamento de erros', () => {
    it('deve capturar erros de rede', async () => {
      fetch.mockRejectedValueOnce(new Error('Erro de rede'))

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(result.current.error).toBe('Erro de rede')
    })

    it('deve limpar erro ao fazer nova operação', async () => {
      // Primeiro, gera um erro
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { result } = renderUseNotifications('empregador', false)

      await act(async () => {
        await result.current.fetchNotifications()
      })

      expect(result.current.error).toBe('Erro ao buscar notificações')

      // Depois, faz uma operação bem-sucedida
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: [],
          message: 'Notificações carregadas com sucesso'
        }),
      })

      await act(async () => {
        await result.current.fetchNotifications()
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
      })
    })
  })
}) 
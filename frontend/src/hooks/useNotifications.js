/**
 * @fileoverview Hook para gerenciar notificações
 * @directory src/hooks
 * @description Hook personalizado para operações CRUD de notificações
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useMessageSnackbar } from '@/hooks/useMessageSnackbar'

/**
 * Hook para gerenciar notificações do usuário
 * @param {string} profile - Perfil do usuário para adaptação
 * @param {boolean} autoFetch - Se deve buscar notificações automaticamente ao montar (default: true)
 * @returns {Object} Estado e funções para gerenciar notificações
 */
export const useNotifications = (profile = 'empregador', autoFetch = true) => {
  const { t } = useTranslation('common')
  const { showMessage } = useMessageSnackbar()
  
  // Estados
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
    urgent: 0
  })

  /**
   * Busca notificações do usuário
   */
  const fetchNotifications = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        unread_only: filters.unread_only || false,
        notification_type: filters.notification_type || '',
        profile
      })

      const response = await fetch(`/api/notifications?${params}`)
      
      if (!response.ok) {
        throw new Error(t('notifications.fetch_error', 'Erro ao buscar notificações'))
      }

      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data)
        
        // Atualiza estatísticas
        const unreadCount = data.data.filter(n => !n.lida).length
        const todayCount = data.data.filter(n => {
          const today = new Date().toDateString()
          const notificationDate = new Date(n.data_criacao).toDateString()
          return today === notificationDate
        }).length
        const urgentCount = data.data.filter(n => n.prioridade === 'urgente').length
        
        setStats({
          total: data.data.length,
          unread: unreadCount,
          today: todayCount,
          urgent: urgentCount
        })
      } else {
        throw new Error(data.message || t('notifications.fetch_error', 'Erro ao buscar notificações'))
      }
      
    } catch (err) {
      setError(err.message)
      showMessage(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [t, showMessage, profile])

  /**
   * Cria uma nova notificação
   */
  const createNotification = useCallback(async (notificationData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      })
      
      if (!response.ok) {
        throw new Error(t('notifications.create_error', 'Erro ao criar notificação'))
      }

      const data = await response.json()
      
      if (data.success) {
        // Adiciona a nova notificação à lista
        setNotifications(prev => [data.data, ...prev])
        
        // Atualiza estatísticas
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          unread: prev.unread + 1,
          today: prev.today + 1
        }))
        
        showMessage(t('notifications.created_success', 'Notificação criada com sucesso'), 'success')
        return data.data
      } else {
        throw new Error(data.message || t('notifications.create_error', 'Erro ao criar notificação'))
      }
      
    } catch (err) {
      setError(err.message)
      showMessage(err.message, 'error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [t, showMessage])

  /**
   * Marca uma notificação como lida
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notification_id: notificationId })
      })
      
      if (!response.ok) {
        throw new Error(t('notifications.mark_read_error', 'Erro ao marcar como lida'))
      }

      const data = await response.json()
      
      if (data.success) {
        // Atualiza a notificação na lista
        setNotifications(prev => 
          (Array.isArray(prev) ? prev : []).map(n => 
            n.id === notificationId 
              ? { ...n, lida: true, data_leitura: data.data.data_leitura }
              : n
          )
        )
        
        // Atualiza estatísticas
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }))
        
        showMessage(t('notifications.marked_read', 'Notificação marcada como lida'), 'success')
        return data.data
      } else {
        throw new Error(data.message || t('notifications.mark_read_error', 'Erro ao marcar como lida'))
      }
      
    } catch (err) {
      setError(err.message)
      showMessage(err.message, 'error')
      throw err
    }
  }, [t, showMessage])

  /**
   * Marca todas as notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mark_all: true })
      })
      
      if (!response.ok) {
        throw new Error(t('notifications.mark_all_read_error', 'Erro ao marcar todas como lidas'))
      }

      const data = await response.json()
      
      if (data.success) {
        // Marca todas como lidas na lista
        setNotifications(prev => 
          (Array.isArray(prev) ? prev : []).map(n => ({ ...n, lida: true }))
        )
        
        // Atualiza estatísticas
        setStats(prev => ({
          ...prev,
          unread: 0
        }))
        
        showMessage(data.message || t('notifications.all_marked_read', 'Todas as notificações marcadas como lidas'), 'success')
        return data.data
      } else {
        throw new Error(data.message || t('notifications.mark_all_read_error', 'Erro ao marcar todas como lidas'))
      }
      
    } catch (err) {
      setError(err.message)
      showMessage(err.message, 'error')
      throw err
    }
  }, [t, showMessage])

  /**
   * Atualiza uma notificação
   */
  const updateNotification = useCallback(async (notificationId, updateData) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        throw new Error(t('notifications.update_error', 'Erro ao atualizar notificação'))
      }

      const data = await response.json()
      
      if (data.success) {
        // Atualiza a notificação na lista
        setNotifications(prev => 
          (Array.isArray(prev) ? prev : []).map(n => 
            n.id === notificationId 
              ? { ...n, ...data.data }
              : n
          )
        )
        
        showMessage(t('notifications.updated_success', 'Notificação atualizada com sucesso'), 'success')
        return data.data
      } else {
        throw new Error(data.message || t('notifications.update_error', 'Erro ao atualizar notificação'))
      }
      
    } catch (err) {
      setError(err.message)
      showMessage(err.message, 'error')
      throw err
    }
  }, [t, showMessage])

  /**
   * Deleta uma notificação
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(t('notifications.delete_error', 'Erro ao deletar notificação'))
      }

      const data = await response.json()
      
      if (data.success) {
        // Remove a notificação da lista
        setNotifications(prev => (Array.isArray(prev) ? prev : []).filter(n => n.id !== notificationId))
        
        // Atualiza estatísticas
        setStats(prev => {
          const deletedNotification = (Array.isArray(notifications) ? notifications : []).find(n => n.id === notificationId)
          return {
            ...prev,
            total: Math.max(0, prev.total - 1),
            unread: deletedNotification && !deletedNotification.lida 
              ? Math.max(0, prev.unread - 1) 
              : prev.unread,
            urgent: deletedNotification && deletedNotification.prioridade === 'urgente'
              ? Math.max(0, prev.urgent - 1)
              : prev.urgent
          }
        })
        
        showMessage(t('notifications.deleted_success', 'Notificação deletada com sucesso'), 'success')
        return true
      } else {
        throw new Error(data.message || t('notifications.delete_error', 'Erro ao deletar notificação'))
      }
      
    } catch (err) {
      setError(err.message)
      showMessage(err.message, 'error')
      throw err
    }
  }, [t, showMessage, notifications])

  /**
   * Busca notificações na inicialização
   */
  useEffect(() => {
    if (autoFetch) fetchNotifications()
  }, [fetchNotifications, autoFetch])

  return {
    // Estados
    notifications,
    loading,
    error,
    stats,
    
    // Funções
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    updateNotification,
    deleteNotification,
    
    // Utilitários
    hasUnread: stats.unread > 0,
    hasUrgent: stats.urgent > 0,
    hasToday: stats.today > 0
  }
} 
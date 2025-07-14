/**
 * @fileoverview Hook para gerenciamento de grupos
 * @directory frontend/src/hooks
 * @description Hook customizado para operações CRUD de grupos, filtros e estatísticas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/utils/i18n'
import { useUser } from '@/context/UserContext'

export const useGroups = () => {
  const { t } = useTranslation('common')
  const { user } = useUser()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  // Buscar todos os grupos
  const fetchGroups = useCallback(async (filters) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.type) params.append('type', filters.type)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.min_members) params.append('min_members', filters.min_members.toString())
      if (filters?.max_members) params.append('max_members', filters.max_members.toString())

      const response = await fetch(`/api/groups?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(t('groups.fetch.error'))
      }

      const data = await response.json()
      setGroups(data.groups || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('groups.fetch.error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  // Buscar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/groups/stats')
      
      if (!response.ok) {
        throw new Error(t('groups.stats.error'))
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
    }
  }, [t])

  // Criar grupo
  const createGroup = useCallback(async (groupData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      })
      
      if (!response.ok) {
        throw new Error(t('groups.create.error'))
      }

      const newGroup = await response.json()
      setGroups(prev => [newGroup, ...prev])
      await fetchStats()
      return newGroup
    } catch (err) {
      setError(err instanceof Error ? err.message : t('groups.create.error'))
      return null
    } finally {
      setLoading(false)
    }
  }, [t, fetchStats])

  // Atualizar grupo
  const updateGroup = useCallback(async (groupId, groupData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      })
      
      if (!response.ok) {
        throw new Error(t('groups.update.error'))
      }

      const updatedGroup = await response.json()
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ))
      await fetchStats()
      return updatedGroup
    } catch (err) {
      setError(err instanceof Error ? err.message : t('groups.update.error'))
      return null
    } finally {
      setLoading(false)
    }
  }, [t, fetchStats])

  // Excluir grupo
  const deleteGroup = useCallback(async (groupId) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(t('groups.delete.error'))
      }

      setGroups(prev => prev.filter(group => group.id !== groupId))
      await fetchStats()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : t('groups.delete.error'))
      return false
    } finally {
      setLoading(false)
    }
  }, [t, fetchStats])

  // Ativar/Desativar grupo
  const toggleGroupStatus = useCallback(async (groupId) => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return false

    const newStatus = group.status === 'active' ? 'inactive' : 'active'
    const result = await updateGroup(groupId, { status: newStatus })
    return result !== null
  }, [groups, updateGroup])

  // Buscar membros de um grupo
  const fetchGroupMembers = useCallback(async (groupId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`)
      
      if (!response.ok) {
        throw new Error(t('groups.members.fetch.error'))
      }

      const data = await response.json()
      return data.members || []
    } catch (err) {
      console.error('Erro ao buscar membros:', err)
      return []
    }
  }, [t])

  // Adicionar membro ao grupo
  const addMember = useCallback(async (groupId, memberData) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      })
      
      if (!response.ok) {
        throw new Error(t('groups.members.add.error'))
      }

      const newMember = await response.json()
      await fetchStats()
      return newMember
    } catch (err) {
      console.error('Erro ao adicionar membro:', err)
      return null
    }
  }, [t, fetchStats])

  // Remover membro do grupo
  const removeMember = useCallback(async (groupId, memberId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(t('groups.members.remove.error'))
      }

      await fetchStats()
      return true
    } catch (err) {
      console.error('Erro ao remover membro:', err)
      return false
    }
  }, [t, fetchStats])

  // Atualizar papel do membro
  const updateMemberRole = useCallback(async (
    groupId, 
    memberId, 
    role
  ) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })
      
      if (!response.ok) {
        throw new Error(t('groups.members.update.error'))
      }

      const updatedMember = await response.json()
      return updatedMember
    } catch (err) {
      console.error('Erro ao atualizar papel do membro:', err)
      return null
    }
  }, [t])

  // Buscar grupos do usuário atual
  const fetchUserGroups = useCallback(async () => {
    if (!user?.id) return []
    
    try {
      const response = await fetch(`/api/groups/user/${user.id}`)
      
      if (!response.ok) {
        throw new Error(t('groups.user.fetch.error'))
      }

      const data = await response.json()
      return data.groups || []
    } catch (err) {
      console.error('Erro ao buscar grupos do usuário:', err)
      return []
    }
  }, [user?.id, t])

  // Inicializar dados
  useEffect(() => {
    fetchGroups()
    fetchStats()
  }, [fetchGroups, fetchStats])

  return {
    groups,
    loading,
    error,
    stats,
    fetchGroups,
    fetchStats,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleGroupStatus,
    fetchGroupMembers,
    addMember,
    removeMember,
    updateMemberRole,
    fetchUserGroups,
  }
} 
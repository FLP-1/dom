/**
 * @fileoverview API de estatísticas de grupos
 * @directory frontend/pages/api/groups
 * @description Endpoint para buscar estatísticas de grupos
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import { NextApiRequest, NextApiResponse } from 'next'

// Mock data para desenvolvimento
const mockGroups = [
  {
    id: '1',
    name: 'Família Silva',
    type: 'family',
    status: 'active',
    member_count: 5,
    admin_count: 2,
  },
  {
    id: '2',
    name: 'Equipe de Limpeza',
    type: 'work',
    status: 'active',
    member_count: 8,
    admin_count: 1,
  },
  {
    id: '3',
    name: 'Condomínio Verde',
    type: 'community',
    status: 'active',
    member_count: 12,
    admin_count: 3,
  },
  {
    id: '4',
    name: 'Projeto Especial',
    type: 'other',
    status: 'inactive',
    member_count: 3,
    admin_count: 1,
  },
  {
    id: '5',
    name: 'Família Santos',
    type: 'family',
    status: 'active',
    member_count: 4,
    admin_count: 1,
  },
  {
    id: '6',
    name: 'Equipe Manutenção',
    type: 'work',
    status: 'active',
    member_count: 6,
    admin_count: 1,
  },
]

export default function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${method} Not Allowed` })
  }

  try {
    // Calcular estatísticas
    const totalGroups = mockGroups.length
    const activeGroups = mockGroups.filter(group => group.status === 'active').length
    const inactiveGroups = mockGroups.filter(group => group.status === 'inactive').length
    const totalMembers = mockGroups.reduce((sum, group) => sum + group.member_count, 0)

    // Estatísticas por tipo
    const groupsByType = {
      family: mockGroups.filter(group => group.type === 'family').length,
      work: mockGroups.filter(group => group.type === 'work').length,
      community: mockGroups.filter(group => group.type === 'community').length,
      other: mockGroups.filter(group => group.type === 'other').length,
    }

    const stats = {
      total_groups: totalGroups,
      active_groups: activeGroups,
      inactive_groups: inactiveGroups,
      total_members: totalMembers,
      groups_by_type: groupsByType,
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
} 
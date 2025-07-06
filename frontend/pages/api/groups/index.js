/**
 * @fileoverview API de grupos
 * @directory frontend/pages/api/groups
 * @description Endpoints para gerenciamento de grupos
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
    description: 'Grupo familiar para organização doméstica',
    type: 'family',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    member_count: 5,
    admin_count: 2,
  },
  {
    id: '2',
    name: 'Equipe de Limpeza',
    description: 'Grupo de trabalho para serviços de limpeza',
    type: 'work',
    status: 'active',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-12T09:15:00Z',
    member_count: 8,
    admin_count: 1,
  },
  {
    id: '3',
    name: 'Condomínio Verde',
    description: 'Grupo da comunidade do condomínio',
    type: 'community',
    status: 'active',
    created_at: '2024-01-05T16:45:00Z',
    updated_at: '2024-01-08T11:20:00Z',
    member_count: 12,
    admin_count: 3,
  },
  {
    id: '4',
    name: 'Projeto Especial',
    description: 'Grupo para projeto temporário',
    type: 'other',
    status: 'inactive',
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-01-22T17:30:00Z',
    member_count: 3,
    admin_count: 1,
  },
]

export default function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}

function handleGet(req, res) {
  try {
    const { type, status, search, min_members, max_members } = req.query

    let filteredGroups = [...mockGroups]

    // Filtro por tipo
    if (type && typeof type === 'string') {
      filteredGroups = filteredGroups.filter(group => group.type === type)
    }

    // Filtro por status
    if (status && typeof status === 'string') {
      filteredGroups = filteredGroups.filter(group => group.status === status)
    }

    // Filtro por busca
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      filteredGroups = filteredGroups.filter(group =>
        group.name.toLowerCase().includes(searchLower) ||
        (group.description && group.description.toLowerCase().includes(searchLower))
      )
    }

    // Filtro por quantidade mínima de membros
    if (min_members && typeof min_members === 'string') {
      const min = parseInt(min_members)
      filteredGroups = filteredGroups.filter(group => group.member_count >= min)
    }

    // Filtro por quantidade máxima de membros
    if (max_members && typeof max_members === 'string') {
      const max = parseInt(max_members)
      filteredGroups = filteredGroups.filter(group => group.member_count <= max)
    }

    res.status(200).json({
      groups: filteredGroups,
      total: filteredGroups.length,
    })
  } catch (error) {
    console.error('Erro ao buscar grupos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

function handlePost(req, res) {
  try {
    const { name, description, type } = req.body

    // Validação básica
    if (!name || !type) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' })
    }

    // Criar novo grupo
    const newGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim(),
      type,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_count: 0,
      admin_count: 0,
    }

    // Em produção, salvar no banco de dados
    mockGroups.unshift(newGroup)

    res.status(201).json(newGroup)
  } catch (error) {
    console.error('Erro ao criar grupo:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
} 
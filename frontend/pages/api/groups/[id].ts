/**
 * @fileoverview API de grupo específico
 * @directory frontend/pages/api/groups
 * @description Endpoints para operações específicas de um grupo
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

// Mock data para desenvolvimento
let mockGroups = [
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

export default async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do grupo é obrigatório' })
  }

  switch (method) {
    case 'GET':
      return handleGet(id, res)
    case 'PUT':
      return handlePut(id, req, res)
    case 'DELETE':
      return handleDelete(id, res)
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}

async function handleGet(id, res) {
  try {
    const group = mockGroups.find(g => g.id === id)
    
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' })
    }

    res.status(200).json(group)
  } catch (error) {
    console.error('Erro ao buscar grupo:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handlePut(id, req, res) {
  try {
    const { name, description, type, status } = req.body
    const groupIndex = mockGroups.findIndex(g => g.id === id)
    
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Grupo não encontrado' })
    }

    // Atualizar grupo
    const updatedGroup = {
      ...mockGroups[groupIndex],
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() || null }),
      ...(type && { type }),
      ...(status && { status }),
      updated_at: new Date().toISOString(),
    }

    mockGroups[groupIndex] = updatedGroup

    res.status(200).json(updatedGroup)
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleDelete(id, res) {
  try {
    const groupIndex = mockGroups.findIndex(g => g.id === id)
    
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Grupo não encontrado' })
    }

    // Remover grupo
    mockGroups = mockGroups.filter(g => g.id !== id)

    res.status(204).end()
  } catch (error) {
    console.error('Erro ao excluir grupo:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
} 
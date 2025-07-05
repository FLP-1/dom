/**
 * @fileoverview Session Context API
 * @directory pages/api/auth/session
 * @description API para gerenciar o contexto ativo da sessão do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import type { NextApiRequest, NextApiResponse } from 'next'

interface ContextUpdateRequest {
  groupId: string
  role: string
}

interface ContextResponse {
  success: boolean
  message?: string
  active_context_group_id?: string
  active_context_role?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContextResponse>
) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido'
    })
  }

  const token = authHeader.substring(7)
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'

  if (req.method === 'GET') {
    // Buscar contexto ativo da sessão
    try {
      const response = await fetch(`${backendUrl}/api/auth/session/context`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return res.status(response.status).json({
          success: false,
          message: errorData.detail || 'Erro ao buscar contexto da sessão'
        })
      }

      const context = await response.json()

      return res.status(200).json({
        success: true,
        active_context_group_id: context.active_context_group_id,
        active_context_role: context.active_context_role
      })

    } catch (error) {
      console.error('Erro na API session context GET:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  } else if (req.method === 'POST') {
    // Atualizar contexto ativo da sessão
    try {
      const { groupId, role }: ContextUpdateRequest = req.body

      if (!groupId || !role) {
        return res.status(400).json({
          success: false,
          message: 'groupId e role são obrigatórios'
        })
      }

      const response = await fetch(`${backendUrl}/api/auth/session/context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ groupId, role })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return res.status(response.status).json({
          success: false,
          message: errorData.detail || 'Erro ao atualizar contexto da sessão'
        })
      }

      const result = await response.json()

      return res.status(200).json({
        success: true,
        active_context_group_id: result.active_context_group_id,
        active_context_role: result.active_context_role
      })

    } catch (error) {
      console.error('Erro na API session context POST:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  } else {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    })
  }
} 
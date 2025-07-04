/**
 * @fileoverview Me API
 * @directory pages/api/auth
 * @description API para buscar dados do usuário atual
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import type { NextApiRequest, NextApiResponse } from 'next'

interface UserResponse {
  success: boolean
  message?: string
  id?: string
  name?: string
  nickname?: string
  cpf?: string
  profile?: string
  email?: string
  celular?: string
  user_photo?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      })
    }

    const token = authHeader.substring(7)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${backendUrl}/api/auth/me`, {
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
        message: errorData.message || 'Erro ao buscar dados do usuário'
      })
    }

    const data = await response.json()

    // Retorna os dados do usuário
    return res.status(200).json({
      success: true,
      id: data.id,
      name: data.name,
      nickname: data.nickname,
      cpf: data.cpf,
      profile: data.profile,
      email: data.email,
      celular: data.celular,
      user_photo: data.user_photo
    })

  } catch (error) {
    console.error('Erro na API me:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
} 
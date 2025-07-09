/**
 * @fileoverview Logout API
 * @directory pages/api/auth
 * @description API para logout e invalidação de sessão
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { getApiMessage } from '@/utils/apiMessages'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: getApiMessage('method_not_allowed')
    })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: getApiMessage('token_not_provided')
      })
    }

    const token = authHeader.substring(7)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    // Chamar endpoint de logout no backend
    const response = await fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    // Sempre retornar sucesso, mesmo se o backend falhar
    // O importante é limpar os dados locais
    return res.status(200).json({
      success: true,
      message: getApiMessage('logout_success')
    })

  } catch (error) {
    console.error('Erro na API de logout:', error)
    // Mesmo com erro, retornar sucesso para garantir que o frontend limpe os dados
    return res.status(200).json({
      success: true,
      message: getApiMessage('logout_success')
    })
  }
} 
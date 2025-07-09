/**
 * @fileoverview Refresh Token API
 * @directory pages/api/auth
 * @description API para renovar token JWT expirado
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
    
    const response = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        success: false,
        message: errorData.detail || getApiMessage('refresh_error')
      })
    }

    const data = await response.json()

    return res.status(200).json({
      success: true,
      message: getApiMessage('refresh_success'),
      access_token: data.access_token,
      expires_in: data.expires_in
    })

  } catch (error) {
    console.error('Erro na API de refresh:', error)
    return res.status(500).json({
      success: false,
      message: getApiMessage('server_error')
    })
  }
} 
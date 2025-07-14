/**
 * @fileoverview Context Session API
 * @directory pages/api/auth/session
 * @description API para salvar contexto da sessão no backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
    const { groupId, role } = req.body

    if (!groupId || !role) {
      return res.status(400).json({
        success: false,
        message: 'groupId e role são obrigatórios'
      })
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${backendUrl}/api/auth/session/context`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ groupId, role })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        success: false,
        message: errorData.message || 'Erro ao salvar contexto da sessão'
      })
    }

    const data = await response.json()

    return res.status(200).json({
      success: true,
      message: 'Contexto da sessão salvo com sucesso',
      data
    })

  } catch (error) {
    console.error('Erro na API de contexto da sessão:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
} 
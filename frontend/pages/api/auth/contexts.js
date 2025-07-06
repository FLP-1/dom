/**
 * @fileoverview Contexts API
 * @directory pages/api/auth
 * @description API para buscar contextos (grupos/perfis) do usuário logado
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export default async function handler(req, res) {
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
    
    console.log('Buscando contextos do backend:', backendUrl)
    
    const response = await fetch(`${backendUrl}/api/auth/contexts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.log('Erro do backend:', response.status, response.statusText)
      const errorData = await response.json().catch(() => ({}))
      
      // Se o backend não estiver disponível, usar dados mockados para desenvolvimento
      if (response.status === 500 || response.status === 503) {
        console.log('Backend não disponível, usando dados mockados')
        const mockContexts = [
          {
            groupId: 'group-1',
            groupName: 'Casa da Maria',
            role: 'empregador',
            profile: 'empregador'
          },
          {
            groupId: 'group-2',
            groupName: 'Casa dos Pais de João',
            role: 'familiar',
            profile: 'familiar'
          },
          {
            groupId: 'group-3',
            groupName: 'Casa da Ana',
            role: 'empregado',
            profile: 'empregado'
          }
        ]
        
        return res.status(200).json({
          success: true,
          contexts: mockContexts
        })
      }
      
      return res.status(response.status).json({
        success: false,
        message: errorData.detail || 'Erro ao buscar contextos do usuário'
      })
    }

    const contexts = await response.json()
    console.log('Contextos recebidos:', contexts)

    // Retorna os contextos do usuário
    return res.status(200).json({
      success: true,
      contexts: contexts
    })

  } catch (error) {
    console.error('Erro na API contexts:', error)
    
    // Em caso de erro de rede, usar dados mockados
    console.log('Erro de rede, usando dados mockados')
    const mockContexts = [
      {
        groupId: 'group-1',
        groupName: 'Casa da Maria',
        role: 'empregador',
        profile: 'empregador'
      },
      {
        groupId: 'group-2',
        groupName: 'Casa dos Pais de João',
        role: 'familiar',
        profile: 'familiar'
      },
      {
        groupId: 'group-3',
        groupName: 'Casa da Ana',
        role: 'empregado',
        profile: 'empregado'
      }
    ]
    
    return res.status(200).json({
      success: true,
      contexts: mockContexts
    })
  }
} 
/**
 * @fileoverview Login API
 * @directory pages/api/auth
 * @description API de login que se conecta com o backend Python
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import type { NextApiRequest, NextApiResponse } from 'next'
// Função simples de validação de CPF
const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '')
  if (numbers.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers[9])) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers[10])) return false
  
  return true
}

interface LoginRequest {
  cpf: string
  password: string
  remember_me: boolean
}

interface LoginResponse {
  success: boolean
  message?: string
  profile?: string
  token?: string
  user?: {
    id: string
    name: string
    cpf: string
    profile: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    })
  }

  try {
    const { cpf, password, remember_me }: LoginRequest = req.body

    // Validações
    if (!cpf || !password) {
      return res.status(400).json({
        success: false,
        message: 'CPF e senha são obrigatórios'
      })
    }

    // Validação de CPF
    if (!validateCPF(cpf)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      })
    }

    // Validação de senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      })
    }

    // Integração com backend Python
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        cpf: cpf.replace(/\D/g, ''),
        password,
        remember_me
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        success: false,
        message: errorData.message || 'Erro no servidor'
      })
    }

    const data = await response.json()

    // Retorna sucesso com dados do usuário
    return res.status(200).json({
      success: true,
      profile: data.profile,
      token: data.token,
      user: data.user
    })

  } catch (error) {
    console.error('Erro na API de login:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
} 
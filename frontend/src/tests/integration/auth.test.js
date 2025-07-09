/**
 * @fileoverview Testes de integração para autenticação
 * @directory src/tests/integration
 * @description Testes reais conectando com o backend e banco de dados
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Configuração para testes de integração
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// Dados reais de teste (usuários do banco)
const TEST_USERS = {
  empregador: {
    cpf: '303.617.927-51',
    password: '123456',
    profile: 'empregador'
  },
  empregado: {
    cpf: '123.456.789-01',
    password: '123456',
    profile: 'empregado'
  }
}

// Flag para verificar se o backend está disponível
let backendAvailable = false

describe('Testes de Integração - Autenticação', () => {
  beforeAll(async () => {
    // Verificar se o backend está disponível
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        timeout: 5000
      })
      if (response.ok) {
        backendAvailable = true
        console.log('✅ Backend disponível para testes de integração')
      } else {
        throw new Error('Backend não está respondendo corretamente')
      }
    } catch (error) {
      console.warn('⚠️ Backend não disponível, pulando testes de integração')
      console.warn('Para executar estes testes, inicie o backend com: python main.py')
      backendAvailable = false
    }
  })

  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('Login Real', () => {
    it('deve fazer login com usuário empregador real', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      // Aguardar inicialização
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        const loginResult = await result.current.login(TEST_USERS.empregador)
        
        // Verificar se o login foi bem-sucedido
        expect(loginResult).toBeDefined()
        expect(loginResult.access_token).toBeDefined()
        expect(loginResult.profile).toBe('empregador')
        
        // Verificar se o estado foi atualizado
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toBeDefined()
        expect(result.current.token).toBeDefined()
        
        // Verificar se os dados foram salvos no localStorage
        const storedToken = localStorage.getItem('userToken')
        const storedUser = localStorage.getItem('userData')
        
        expect(storedToken).toBe(loginResult.access_token)
        expect(JSON.parse(storedUser)).toEqual(loginResult)
      })
    }, 15000) // Timeout de 15 segundos para testes de integração

    it('deve rejeitar credenciais inválidas', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        try {
          await result.current.login({
            cpf: '000.000.000-00',
            password: 'senha_errada'
          })
          
          // Se chegou aqui, deveria ter falhado
          throw new Error('Login deveria ter falhado')
          
        } catch (error) {
          // Esperado que falhe
          expect(error.message).toBeDefined()
          expect(result.current.isAuthenticated).toBe(false)
          expect(result.current.error).toBeDefined()
        }
      })
    }, 15000)
  })

  describe('Validação de Token Real', () => {
    it('deve validar token JWT real do backend', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        // Fazer login para obter token real
        const loginResult = await result.current.login(TEST_USERS.empregador)
        const token = loginResult.access_token
        
        // Verificar se o token é válido
        const isValid = result.current.isTokenValid(token)
        expect(isValid).toBe(true)
        
        // Verificar se o token tem o formato correto (3 partes separadas por ponto)
        const tokenParts = token.split('.')
        expect(tokenParts).toHaveLength(3)
      })
    }, 15000)
  })

  describe('Refresh de Token Real', () => {
    it('deve fazer refresh de token real', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        // Fazer login para obter token
        await result.current.login(TEST_USERS.empregador)
        const originalToken = result.current.token
        
        // Fazer refresh do token
        const newToken = await result.current.refreshToken()
        
        // Verificar se o token foi renovado
        expect(newToken).toBeDefined()
        expect(newToken).not.toBe(originalToken)
        expect(result.current.token).toBe(newToken)
        
        // Verificar se foi salvo no localStorage
        const storedToken = localStorage.getItem('userToken')
        expect(storedToken).toBe(newToken)
      })
    }, 15000)
  })

  describe('Logout Real', () => {
    it('deve fazer logout e limpar dados', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        // Fazer login primeiro
        await result.current.login(TEST_USERS.empregador)
        expect(result.current.isAuthenticated).toBe(true)
        
        // Fazer logout
        await result.current.logout()
        
        // Verificar se os dados foram limpos
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBe(null)
        expect(result.current.token).toBe(null)
        
        // Verificar se localStorage foi limpo
        expect(localStorage.getItem('userToken')).toBe(null)
        expect(localStorage.getItem('userData')).toBe(null)
      })
    }, 15000)
  })

  describe('Permissões Reais', () => {
    it('deve verificar permissões com usuário real', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        // Fazer login com usuário empregador
        await result.current.login(TEST_USERS.empregador)
        
        // Verificar permissões específicas do empregador
        expect(result.current.hasPermission('/dashboard')).toBe(true)
        expect(result.current.hasPermission('/people')).toBe(true)
        expect(result.current.hasPermission('/tasks')).toBe(true)
        expect(result.current.hasPermission('/groups')).toBe(true)
        expect(result.current.hasPermission('/admin')).toBe(false)
      })
    }, 15000)
  })

  describe('Headers de Autorização Reais', () => {
    it('deve gerar headers com token real', async () => {
      if (!backendAvailable) {
        console.log('⏭️ Pulando teste - backend não disponível')
        return
      }

      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      }, { timeout: 5000 })

      await act(async () => {
        // Fazer login para obter token real
        await result.current.login(TEST_USERS.empregador)
        
        // Gerar headers de autorização
        const headers = result.current.getAuthHeaders()
        
        // Verificar se os headers estão corretos
        expect(headers).toHaveProperty('Authorization')
        expect(headers).toHaveProperty('Content-Type')
        expect(headers['Content-Type']).toBe('application/json')
        expect(headers['Authorization']).toMatch(/^Bearer /)
        
        // Verificar se o token no header é o mesmo do estado
        const tokenFromHeader = headers['Authorization'].replace('Bearer ', '')
        expect(tokenFromHeader).toBe(result.current.token)
      })
    }, 15000)
  })
}) 
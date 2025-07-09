/**
 * @fileoverview Testes do hook useAuth
 * @directory src/hooks/__tests__  
 * @description Testes unitários para o hook de autenticação
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

// Polyfill para atob no ambiente Node.js
if (typeof global.atob === 'undefined') {
  global.atob = function(str) {
    return Buffer.from(str, 'base64').toString('binary')
  }
}

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock simples do sistema de mensagens
jest.mock('@/utils/messages/auth', () => ({
  useAuthMessages: () => ({
    t: (key) => {
      const messages = {
        'token_not_found': 'Token não encontrado',
        'login_success': 'Login realizado com sucesso',
        'login_error': 'Erro no login',
        'logout_success': 'Logout realizado com sucesso',
        'token_expired': 'Token expirado',
        'token_invalid': 'Token inválido',
        'refresh_failed': 'Falha no refresh do token'
      }
      return messages[key] || key
    }
  })
}))

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

// Mock do fetch para simular respostas da API
const mockFetch = jest.fn()
global.fetch = mockFetch

// Dados de teste reais
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

// Função para criar JWT real
const createTestJWT = (userData, expiresIn = '1h') => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: userData.cpf,
    profile: userData.profile,
    exp: Math.floor(Date.now() / 1000) + (expiresIn === '1h' ? 3600 : -3600)
  }
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = 'test_signature'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

describe('useAuth', () => {
  beforeEach(() => {
    // Limpar localStorage
    localStorage.clear()
    // Limpar mocks
    mockFetch.mockClear()
  })

  describe('inicialização', () => {
    it('deve inicializar com estado não autenticado', async () => {
      const { result } = renderHook(() => useAuth())
      
      // Aguardar a inicialização
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('deve carregar dados do localStorage se disponível', async () => {
      const testUser = {
        id: '1',
        name: 'Maria Silva',
        profile: 'empregador',
        cpf: '303.617.927-51',
        nickname: 'Maria',
        email: 'maria@exemplo.com',
        celular: '(11) 99999-9999',
        user_photo: null,
        access_token: createTestJWT({ cpf: '303.617.927-51', profile: 'empregador' })
      }
      
      localStorage.setItem('userToken', testUser.access_token)
      localStorage.setItem('userData', JSON.stringify(testUser))
      
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.user).toEqual(testUser)
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('login', () => {
    it('deve fazer login com sucesso usando credenciais reais', async () => {
      const testUser = {
        id: '1',
        name: 'Maria Silva',
        profile: 'empregador',
        cpf: '303.617.927-51',
        nickname: 'Maria',
        email: 'maria@exemplo.com',
        celular: '(11) 99999-9999',
        user_photo: null,
        access_token: createTestJWT({ cpf: '303.617.927-51', profile: 'empregador' })
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          ...testUser
        })
      })
      
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        await result.current.login({
          cpf: '303.617.927-51',
          password: '123456'
        })
      })
      
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toEqual(testUser)
      })
    })

    it('deve tratar erro de login com credenciais inválidas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Credenciais inválidas'
        })
      })
      
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.login({
            cpf: 'invalid',
            password: 'invalid'
          })
        } catch (error) {
          expect(error.message).toBe('Credenciais inválidas')
        }
      })
      
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })

  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        await result.current.logout()
      })
      
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(localStorage.getItem('userToken')).toBeNull()
    })
  })

  describe('hasPermission', () => {
    it('deve verificar permissões corretamente para empregador', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      // Simular usuário empregador logado através do localStorage
      const empregadorUser = {
        id: '1',
        name: 'Maria Silva',
        profile: 'empregador',
        cpf: '303.617.927-51',
        nickname: 'Maria',
        email: 'maria@exemplo.com',
        celular: '(11) 99999-9999',
        user_photo: null,
        access_token: createTestJWT({ cpf: '303.617.927-51', profile: 'empregador' })
      }
      
      localStorage.setItem('userToken', empregadorUser.access_token)
      localStorage.setItem('userData', JSON.stringify(empregadorUser))
      
      // Re-renderizar o hook para carregar os dados do localStorage
      const { result: newResult } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(newResult.current.isLoading).toBe(false)
        expect(newResult.current.isAuthenticated).toBe(true)
      })
      
      expect(newResult.current.hasPermission('/dashboard')).toBe(true)
      expect(newResult.current.hasPermission('/people')).toBe(true)
      expect(newResult.current.hasPermission('/tasks')).toBe(true)
    })

    it('deve verificar permissões corretamente para empregado', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      // Simular usuário empregado logado através do localStorage
      const empregadoUser = {
        id: '2',
        name: 'João Santos',
        profile: 'empregado',
        cpf: '123.456.789-01',
        nickname: 'João',
        email: 'joao@exemplo.com',
        celular: '(11) 88888-8888',
        user_photo: null,
        access_token: createTestJWT({ cpf: '123.456.789-01', profile: 'empregado' })
      }
      
      localStorage.setItem('userToken', empregadoUser.access_token)
      localStorage.setItem('userData', JSON.stringify(empregadoUser))
      
      // Re-renderizar o hook para carregar os dados do localStorage
      const { result: newResult } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(newResult.current.isLoading).toBe(false)
        expect(newResult.current.isAuthenticated).toBe(true)
      })
      
      expect(newResult.current.hasPermission('/dashboard')).toBe(true)
      expect(newResult.current.hasPermission('/people')).toBe(false) // Empregado não tem acesso
      expect(newResult.current.hasPermission('/tasks')).toBe(true)
    })

    it('deve retornar false se não há usuário', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.hasPermission('/dashboard')).toBe(false)
    })
  })

  describe('getAuthHeaders', () => {
    it('deve retornar headers de autorização com token real', async () => {
      const { result } = renderHook(() => useAuth())
      const testToken = createTestJWT({ cpf: '123', profile: 'empregador' })
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      // Simular token no localStorage
      localStorage.setItem('userToken', testToken)
      
      const headers = result.current.getAuthHeaders()
      
      expect(headers).toHaveProperty('Authorization')
      expect(headers.Authorization).toContain('Bearer')
      expect(headers.Authorization).toContain(testToken)
    })

    it('deve retornar headers sem token se não autenticado', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      const headers = result.current.getAuthHeaders()
      
      expect(headers).toHaveProperty('Authorization')
      expect(headers.Authorization).toBe('Bearer null')
    })
  })

  describe('isTokenValid', () => {
    it('deve validar token JWT válido', async () => {
      const { result } = renderHook(() => useAuth())
      const validToken = createTestJWT({ cpf: '123', profile: 'empregador' })
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.isTokenValid(validToken)).toBe(true)
    })

    it('deve invalidar token JWT expirado', async () => {
      const { result } = renderHook(() => useAuth())
      const expiredToken = createTestJWT({ cpf: '123', profile: 'empregador' }, 'expired')
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.isTokenValid(expiredToken)).toBe(false)
    })

    it('deve invalidar token inválido', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.isTokenValid('invalid_token')).toBe(false)
      expect(result.current.isTokenValid('')).toBe(false)
      expect(result.current.isTokenValid(null)).toBe(false)
    })
  })

  describe('refreshToken', () => {
    it('deve fazer refresh de token com sucesso', async () => {
      const newToken = createTestJWT({ cpf: '123', profile: 'empregador' })
      const currentToken = createTestJWT({ cpf: '123', profile: 'empregador' })
      
      // Simular token atual no localStorage
      localStorage.setItem('userToken', currentToken)
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          access_token: newToken
        })
      })
      
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        await result.current.refreshToken()
      })
      
      expect(localStorage.getItem('userToken')).toBe(newToken)
    })

    it('deve tratar erro de refresh sem token', async () => {
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.refreshToken()
        } catch (error) {
          expect(error.message).toBe('Token não encontrado')
        }
      })
      
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('cenários de erro', () => {
    it('deve lidar com erro de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.login({
            cpf: 'test',
            password: 'test'
          })
        } catch (error) {
          expect(error.message).toBe('Network error')
        }
      })
      
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('deve lidar com resposta malformada da API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null // Resposta malformada
      })
      
      const { result } = renderHook(() => useAuth())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        try {
          await result.current.login({
            cpf: 'test',
            password: 'test'
          })
        } catch (error) {
          expect(error.message).toBe('Cannot read properties of null (reading \'success\')')
        }
      })
      
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
}) 
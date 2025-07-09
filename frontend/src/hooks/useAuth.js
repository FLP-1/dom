/**
 * @fileoverview Hook de autenticação
 * @directory src/hooks
 * @description Hook para gerenciar autenticação JWT com validação e refresh automático
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { logout } from '@/logout'
import { useAuthMessages } from '@/utils/messages/auth'

/**
 * Hook para gerenciar autenticação JWT
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.autoRefresh - Se deve fazer refresh automático do token
 * @param {number} options.refreshThreshold - Tempo em minutos antes do vencimento para fazer refresh
 * @returns {Object} Objeto com funções e estado de autenticação
 */
export const useAuth = (options = {}) => {
  const { autoRefresh = true, refreshThreshold = 5 } = options
  const router = useRouter()
  const { t } = useAuthMessages()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  // Usar useRef para evitar dependências circulares
  const refreshTokenRef = useRef()
  const handleLogoutRef = useRef()

  /**
   * Faz logout do usuário
   */
  const handleLogout = useCallback(async () => {
    try {
      // Chamar endpoint de logout no backend (se existir)
      const currentToken = localStorage.getItem('userToken')
      if (currentToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        }).catch(() => {
          // Ignorar erros no logout do backend
        })
      }
    } catch (error) {
      console.error('Erro ao fazer logout no backend:', error)
    } finally {
      // Limpar dados locais
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('activeContext')
      
      // Atualizar estado
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      
      // Redirecionar para login
      router.push('/login')
    }
  }, [router])

  // Atualizar ref
  handleLogoutRef.current = handleLogout

  /**
   * Faz refresh do token JWT
   */
  const refreshToken = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('userToken')
      if (!currentToken) {
        throw new Error(t('token_not_found'))
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('userToken', data.access_token)
        setToken(data.access_token)
        return data.access_token
      } else {
        throw new Error(t('refresh_failed'))
      }
    } catch (error) {
      console.error('Erro ao fazer refresh do token:', error)
      // Se falhar o refresh, fazer logout
      await handleLogoutRef.current()
      throw error
    }
  }, [t])

  // Atualizar ref
  refreshTokenRef.current = refreshToken

  /**
   * Verifica se o token JWT é válido
   * @param {string} token - Token JWT
   * @returns {boolean} Se o token é válido
   */
  const isTokenValid = useCallback((token) => {
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      // Verificar se o token não expirou
      if (payload.exp && payload.exp < now) {
        return false
      }
      
      // Verificar se está próximo do vencimento (para refresh automático)
      if (autoRefresh && payload.exp) {
        const timeUntilExpiry = payload.exp - now
        const thresholdSeconds = refreshThreshold * 60
        
        if (timeUntilExpiry <= thresholdSeconds) {
          // Token está próximo do vencimento, fazer refresh
          refreshTokenRef.current()
          return true // Ainda é válido por enquanto
        }
      }
      
      return true
    } catch (error) {
      console.error('Erro ao validar token:', error)
      return false
    }
  }, [autoRefresh, refreshThreshold])

  /**
   * Faz login do usuário
   * @param {Object} credentials - Credenciais de login
   * @param {string} credentials.cpf - CPF do usuário
   * @param {string} credentials.password - Senha do usuário
   * @param {boolean} credentials.remember_me - Se deve lembrar o login
   * @returns {Promise<Object>} Dados do usuário logado
   */
  const login = useCallback(async (credentials) => {
    console.log('🔍 useAuth Debug: Iniciando login...')
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔍 useAuth Debug: Fazendo requisição para /api/auth/login')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      console.log('🔍 useAuth Debug: Status da resposta:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('❌ useAuth Debug: Erro na resposta:', errorData)
        throw new Error(errorData.message || t('login_error'))
      }

      const responseData = await response.json()
      console.log('✅ useAuth Debug: Dados recebidos:', responseData)
      
      // Verificar se a resposta tem sucesso
      if (!responseData.success) {
        console.log('❌ useAuth Debug: Resposta sem sucesso:', responseData)
        throw new Error(responseData.message || t('login_error'))
      }
      
      // Extrair dados do usuário
      const userData = {
        id: responseData.id,
        name: responseData.name,
        nickname: responseData.nickname,
        cpf: responseData.cpf,
        profile: responseData.profile,
        email: responseData.email,
        celular: responseData.celular,
        user_photo: responseData.user_photo,
        access_token: responseData.access_token
      }
      
      console.log('🔍 useAuth Debug: Salvando dados no localStorage...')
      // Salvar dados no localStorage
      localStorage.setItem('userToken', userData.access_token)
      localStorage.setItem('userData', JSON.stringify(userData))
      
      console.log('🔍 useAuth Debug: Atualizando estado...')
      // Atualizar estado
      setToken(userData.access_token)
      setUser(userData)
      setIsAuthenticated(true)
      
      console.log('✅ useAuth Debug: Login concluído com sucesso')
      return userData
    } catch (error) {
      console.error('❌ useAuth Debug: Erro no login:', error)
      setError(error.message)
      throw error
    } finally {
      setIsLoading(false)
      console.log('🔍 useAuth Debug: Login finalizado')
    }
  }, [t])

  /**
   * Verifica se o usuário tem permissão para acessar uma rota
   * @param {string} route - Rota a verificar
   * @returns {boolean} Se tem permissão
   */
  const hasPermission = useCallback((route) => {
    if (!user || !user.profile) return false
    
    const routePermissions = {
      '/dashboard': ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner'],
      '/people': ['empregador', 'admin', 'owner'],
      '/tasks': ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner'],
      '/groups': ['empregador', 'parceiro', 'admin', 'owner'],
      '/notifications': ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner'],
      '/settings': ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
    }
    
    const allowedProfiles = routePermissions[route] || []
    return allowedProfiles.includes(user.profile)
  }, [user])

  /**
   * Obtém headers de autorização para requisições
   * @returns {Object} Headers com token de autorização
   */
  const getAuthHeaders = useCallback(() => {
    const currentToken = localStorage.getItem('userToken')
    return {
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    }
  }, [])

  // Inicializar autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 useAuth Debug: Iniciando inicialização...')
      try {
        const storedToken = localStorage.getItem('userToken')
        const storedUser = localStorage.getItem('userData')
        
        console.log('🔍 useAuth Debug:', { 
          hasToken: !!storedToken, 
          hasUser: !!storedUser 
        })
        
        if (storedToken && storedUser) {
          // Verificar se o token é válido
          if (isTokenValid(storedToken)) {
            const userData = JSON.parse(storedUser)
            console.log('🔍 useAuth Debug: Token válido, usuário carregado:', userData)
            setToken(storedToken)
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            console.log('🔍 useAuth Debug: Token inválido, limpando dados')
            // Token inválido, limpar dados
            localStorage.removeItem('userToken')
            localStorage.removeItem('userData')
            localStorage.removeItem('activeContext')
          }
        } else {
          console.log('🔍 useAuth Debug: Sem token ou dados armazenados')
        }
      } catch (error) {
        console.error('❌ useAuth Debug: Erro ao inicializar autenticação:', error)
        // Limpar dados em caso de erro
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('activeContext')
      } finally {
        setIsLoading(false)
        console.log('🔍 useAuth Debug: Inicialização finalizada')
      }
    }

    initializeAuth()
  }, [isTokenValid])

  // Verificar token periodicamente
  useEffect(() => {
    if (!autoRefresh || !token) return

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('userToken')
      if (currentToken && !isTokenValid(currentToken)) {
        handleLogout()
      }
    }, 60000) // Verificar a cada minuto

    return () => clearInterval(interval)
  }, [autoRefresh, token, isTokenValid, handleLogout])

  return {
    // Estado
    isAuthenticated,
    isLoading,
    user,
    token,
    error,
    
    // Funções
    login,
    logout: handleLogout,
    refreshToken,
    hasPermission,
    getAuthHeaders,
    
    // Utilitários
    isTokenValid
  }
} 
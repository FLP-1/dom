/**
 * @fileoverview Utilitários para testes
 * @directory src/utils
 * @description Funções e configurações compartilhadas para testes
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { UserProvider } from '@/context/UserContext'
import { ActiveContextProvider } from '@/context/ActiveContext'

// Dados reais de teste
export const REAL_TEST_DATA = {
  users: [
    {
      id: '1',
      name: 'Maria Silva',
      nickname: 'Maria',
      cpf: '123.456.789-01',
      profile: 'empregador',
      email: 'maria@exemplo.com',
      celular: '(11) 99999-9999',
      user_photo: null,
      ativo: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      groups: [
        { id: '1', name: 'Família Silva' },
        { id: '2', name: 'Trabalho' }
      ]
    },
    {
      id: '2',
      name: 'João Santos',
      nickname: 'João',
      cpf: '987.654.321-00',
      profile: 'empregado',
      email: 'joao@exemplo.com',
      celular: '(11) 88888-8888',
      user_photo: null,
      ativo: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      groups: [
        { id: '1', name: 'Família Silva' }
      ]
    },
    {
      id: '3',
      name: 'Ana Costa',
      nickname: 'Ana',
      cpf: '111.222.333-44',
      profile: 'empregado',
      email: 'ana@exemplo.com',
      celular: '(11) 77777-7777',
      user_photo: null,
      ativo: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      groups: []
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Limpar a casa',
      description: 'Limpar todos os cômodos da casa',
      status: 'pending',
      priority: 'high',
      responsible_id: '2',
      due_date: new Date(Date.now() + 86400000), // Amanhã
      created_at: new Date(),
      updated_at: new Date(),
      tags: ['limpeza', 'casa'],
      location: 'Casa',
      estimated_time: 120,
      actual_time: null,
      completed_at: null,
      photo: null,
      notes: 'Usar produtos de limpeza adequados'
    },
    {
      id: '2',
      title: 'Fazer compras',
      description: 'Comprar itens da lista de supermercado',
      status: 'in_progress',
      priority: 'medium',
      responsible_id: '2',
      due_date: new Date(Date.now() + 43200000), // 12 horas
      created_at: new Date(),
      updated_at: new Date(),
      tags: ['compras', 'supermercado'],
      location: 'Supermercado',
      estimated_time: 60,
      actual_time: 30,
      completed_at: null,
      photo: null,
      notes: 'Verificar lista antes de sair'
    }
  ],
  notifications: [
    {
      id: '1',
      title: 'Nova tarefa atribuída',
      message: 'Você tem uma nova tarefa: Limpar a casa',
      type: 'task_assigned',
      read: false,
      created_at: new Date(),
      user_id: '2',
      related_id: '1',
      related_type: 'task'
    },
    {
      id: '2',
      title: 'Tarefa concluída',
      message: 'A tarefa "Fazer compras" foi concluída',
      type: 'task_completed',
      read: true,
      created_at: new Date(Date.now() - 3600000), // 1 hora atrás
      user_id: '1',
      related_id: '2',
      related_type: 'task'
    }
  ],
  groups: [
    {
      id: '1',
      name: 'Família Silva',
      description: 'Grupo familiar principal',
      owner_id: '1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      member_count: 3,
      active_tasks: 5,
      completed_tasks: 12
    }
  ]
}

// Credenciais reais para testes
export const REAL_CREDENTIALS = {
  empregador: {
    cpf: '123.456.789-01',
    password: 'senha123',
    profile: 'empregador'
  },
  empregado: {
    cpf: '987.654.321-00',
    password: 'senha123',
    profile: 'empregado'
  }
}

// Função para criar resposta real da API
export const createRealApiResponse = (data, success = true, message = 'Success') => {
  return {
    success,
    data: Array.isArray(data) ? data : [data],
    message,
    timestamp: new Date().toISOString()
  }
}

// Função para simular delay real da API
export const simulateApiDelay = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Função para criar token JWT real
export const createRealJWT = (payload = {}) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const defaultPayload = {
    sub: '1',
    name: 'Test User',
    profile: 'empregador',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    ...payload
  }
  
  const finalPayload = { ...defaultPayload, ...payload }
  
  // Simular JWT (em produção seria criptografado)
  const headerB64 = btoa(JSON.stringify(header))
  const payloadB64 = btoa(JSON.stringify(finalPayload))
  const signature = 'mock-signature'
  
  return `${headerB64}.${payloadB64}.${signature}`
}

// Função para configurar fetch real para testes
export const setupRealFetch = () => {
  const originalFetch = global.fetch
  
  global.fetch = jest.fn(async (url, options = {}) => {
    // Simular delay real da API
    await simulateApiDelay(50)
    
    const method = options.method || 'GET'
    const body = options.body ? JSON.parse(options.body) : {}
    
    // Simular diferentes endpoints
    if (url.includes('/api/auth/login')) {
      const { cpf, password } = body
      
      // Verificar credenciais reais
      const user = REAL_TEST_DATA.users.find(u => u.cpf === cpf)
      if (user && password === 'senha123') {
        const token = createRealJWT({ sub: user.id, name: user.name, profile: user.profile })
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            ...user,
            access_token: token
          })
        }
      } else {
        return {
          ok: false,
          status: 401,
          json: async () => ({
            success: false,
            message: 'Credenciais inválidas'
          })
        }
      }
    }
    
    if (url.includes('/api/auth/refresh')) {
      const token = options.headers?.Authorization?.replace('Bearer ', '')
      if (token) {
        const newToken = createRealJWT({ sub: '1', name: 'Test User', profile: 'empregador' })
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            access_token: newToken
          })
        }
      }
      return {
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Token inválido'
        })
      }
    }
    
    if (url.includes('/api/tasks')) {
      if (method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => createRealApiResponse(REAL_TEST_DATA.tasks)
        }
      }
      
      if (method === 'POST') {
        const newTask = {
          id: String(REAL_TEST_DATA.tasks.length + 1),
          ...body,
          created_at: new Date(),
          updated_at: new Date()
        }
        REAL_TEST_DATA.tasks.push(newTask)
        return {
          ok: true,
          status: 201,
          json: async () => createRealApiResponse(newTask)
        }
      }
    }
    
    if (url.includes('/api/users')) {
      return {
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.users)
      }
    }
    
    if (url.includes('/api/notifications')) {
      return {
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.notifications)
      }
    }
    
    if (url.includes('/api/groups')) {
      return {
        ok: true,
        status: 200,
        json: async () => createRealApiResponse(REAL_TEST_DATA.groups)
      }
    }
    
    // Fallback para endpoints não mapeados
    return {
      ok: true,
      status: 200,
      json: async () => createRealApiResponse([])
    }
  })
  
  // Retornar função para restaurar fetch original
  return () => {
    global.fetch = originalFetch
  }
}

// Função para configurar localStorage real
export const setupRealLocalStorage = () => {
  const store = {}
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value
      }),
      removeItem: jest.fn((key) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      })
    },
    writable: true
  })
  
  return store
}

// Função para configurar router real
export const setupRealRouter = () => {
  const mockPush = jest.fn()
  const mockReplace = jest.fn()
  const mockBack = jest.fn()
  
  jest.doMock('next/router', () => ({
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      pathname: '/dashboard',
      query: {},
      asPath: '/dashboard'
    })
  }))
  
  return { mockPush, mockReplace, mockBack }
}

// Função para renderizar componentes com providers reais
export const renderWithProviders = (ui, options = {}) => {
  const {
    theme: customTheme = theme,
    user = null,
    activeContext = null,
    ...renderOptions
  } = options

  const Wrapper = ({ children }) => (
    <ThemeProvider theme={customTheme}>
      <UserProvider initialUser={user}>
        <ActiveContextProvider initialContext={activeContext}>
          {children}
        </ActiveContextProvider>
      </UserProvider>
    </ThemeProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Função para limpar dados de teste
export const cleanupTestData = () => {
  // Limpar localStorage
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
  
  // Limpar dados em memória
  REAL_TEST_DATA.tasks.length = 0
  REAL_TEST_DATA.notifications.length = 0
  // Restaurar dados originais se necessário
}

// Função para aguardar operações assíncronas
export const waitForAsync = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Função para verificar se um elemento está visível
export const isElementVisible = (element) => {
  if (!element) return false
  
  const style = window.getComputedStyle(element)
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetWidth > 0 &&
         element.offsetHeight > 0
}

// Função para simular eventos do usuário
export const simulateUserEvent = async (element, eventType = 'click') => {
  if (!element) return
  
  const event = new Event(eventType, { bubbles: true, cancelable: true })
  element.dispatchEvent(event)
  
  // Aguardar um pouco para que os efeitos sejam processados
  await waitForAsync(50)
}

// Função para verificar se uma função foi chamada com argumentos específicos
export const expectFunctionCalledWith = (mockFn, expectedArgs) => {
  expect(mockFn).toHaveBeenCalled()
  const calls = mockFn.mock.calls
  
  const found = calls.some(call => {
    return expectedArgs.every((expectedArg, index) => {
      const actualArg = call[index]
      if (typeof expectedArg === 'object') {
        return JSON.stringify(actualArg) === JSON.stringify(expectedArg)
      }
      return actualArg === expectedArg
    })
  })
  
  expect(found).toBe(true)
}

// Configuração global para testes
export const setupTestEnvironment = () => {
  // Configurar fetch real
  const restoreFetch = setupRealFetch()
  
  // Configurar localStorage real
  const store = setupRealLocalStorage()
  
  // Configurar router real
  const routerMocks = setupRealRouter()
  
  // Limpar console logs em testes
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  
  return {
    restoreFetch,
    store,
    routerMocks,
    cleanup: () => {
      restoreFetch()
      cleanupTestData()
      jest.restoreAllMocks()
    }
  }
}

const testUtils = {
  REAL_TEST_DATA,
  REAL_CREDENTIALS,
  createRealApiResponse,
  simulateApiDelay,
  createRealJWT,
  setupRealFetch,
  setupRealLocalStorage,
  setupRealRouter,
  renderWithProviders,
  cleanupTestData,
  waitForAsync,
  isElementVisible,
  simulateUserEvent,
  expectFunctionCalledWith,
  setupTestEnvironment
}

export default testUtils 
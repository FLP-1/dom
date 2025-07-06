/**
 * @fileoverview Setup global do Jest
 * @directory frontend
 * @description Configurações globais para todos os testes
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import '@testing-library/jest-dom'

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock do next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'pt-BR',
      changeLanguage: jest.fn(),
    },
  }),
}))

// Mock do Material-UI theme
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { default: '#ffffff' },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  }),
}))

// Mock do fetch global
global.fetch = jest.fn()

// Mock padrão para fetch bem-sucedido
global.fetch.mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ 
    success: true, 
    data: [],
    message: 'Success'
  }),
  text: async () => 'Success'
})

// Mock padrão para fetch com erro
global.fetch.mockRejectedValue = (error) => {
  global.fetch.mockRejectedValueOnce(error)
}

// Mock padrão para fetch com resposta de erro
global.fetch.mockResponseError = (status = 500, message = 'Internal Server Error') => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ 
      success: false, 
      error: message 
    }),
    text: async () => message
  })
}

// Mock padrão para fetch com resposta bem-sucedida
global.fetch.mockResponseSuccess = (data = [], message = 'Success') => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ 
      success: true, 
      data,
      message 
    }),
    text: async () => message
  })
}

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Configurações globais de console para testes
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // Suprimir warnings específicos do React Testing Library
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('act(...)'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    // Suprimir warnings específicos
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('act(...)'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Limpar mocks entre testes
beforeEach(() => {
  jest.clearAllMocks()
  global.fetch.mockClear()
}) 
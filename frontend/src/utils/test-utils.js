/**
 * @fileoverview Utilitários de teste
 * @directory frontend/src/utils
 * @description Funções auxiliares para testes unitários e de integração
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Configuração do i18n para testes
i18n.use(initReactI18next).init({
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    'pt-BR': {
      common: {
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Excluir',
        edit: 'Editar',
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        confirm: 'Confirmar',
        close: 'Fechar',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

// Temas por perfil para testes
const profileThemes = {
  empregador: createTheme({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  }),
  empregado: createTheme({
    palette: {
      primary: { main: '#2e7d32' },
      secondary: { main: '#ff6f00' },
    },
  }),
  familiar: createTheme({
    palette: {
      primary: { main: '#7b1fa2' },
      secondary: { main: '#f50057' },
    },
  }),
  parceiro: createTheme({
    palette: {
      primary: { main: '#1565c0' },
      secondary: { main: '#ff9800' },
    },
  }),
  subordinado: createTheme({
    palette: {
      primary: { main: '#388e3c' },
      secondary: { main: '#ff5722' },
    },
  }),
  admin: createTheme({
    palette: {
      primary: { main: '#d32f2f' },
      secondary: { main: '#9c27b0' },
    },
  }),
  owner: createTheme({
    palette: {
      primary: { main: '#000000' },
      secondary: { main: '#ffd700' },
    },
  }),
}

/**
 * Renderiza um componente com todos os providers necessários
 * @param {React.ReactElement} ui - Componente a ser renderizado
 * @param {Object} options - Opções de renderização
 * @param {string} options.profile - Perfil do usuário para tema
 * @param {Object} options.theme - Tema customizado
 * @param {Object} options.i18n - Instância do i18n
 * @returns {Object} Resultado da renderização
 */
export function renderWithProviders(
  ui,
  {
    profile = 'empregador',
    theme,
    i18nInstance = i18n,
    ...renderOptions
  } = {}
) {
  const selectedTheme = theme || profileThemes[profile] || profileThemes.empregador

  function Wrapper({ children }) {
    return (
      <I18nextProvider i18n={i18nInstance}>
        <ThemeProvider theme={selectedTheme}>
          {children}
        </ThemeProvider>
      </I18nextProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock de dados de usuário para testes
 */
export const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  perfil: 'empregador',
  photo: 'https://example.com/photo.jpg',
  user_photo: 'https://example.com/photo.jpg',
  cpf: '123.456.789-00',
  celular: '(11) 99999-9999',
  nickname: 'joaosilva',
  ativo: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
}

/**
 * Mock de dados de tarefa para testes
 */
export const mockTask = {
  id: '1',
  title: 'Limpar a casa',
  description: 'Limpar todos os cômodos',
  status: 'pending',
  priority: 'medium',
  assignedTo: '2',
  createdBy: '1',
  dueDate: new Date('2024-12-25T00:00:00Z'),
  createdAt: new Date('2024-12-19T00:00:00Z'),
  updatedAt: new Date('2024-12-19T00:00:00Z'),
}

/**
 * Mock de dados de grupo para testes
 */
export const mockGroup = {
  id: '1',
  name: 'Família Silva',
  description: 'Grupo da família Silva',
  ownerId: '1',
  members: ['1', '2', '3'],
  active: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
}

/**
 * Mock de dados de notificação para testes
 */
export const mockNotification = {
  id: '1',
  title: 'Nova tarefa',
  message: 'Você tem uma nova tarefa atribuída',
  type: 'task',
  read: false,
  userId: '1',
  createdAt: new Date('2024-12-19T00:00:00Z'),
}

/**
 * Mock de resposta da API
 */
export const mockApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {},
})

/**
 * Mock de erro da API
 */
export const mockApiError = (message = 'Erro da API', status = 400) => ({
  response: {
    data: { message },
    status,
    statusText: 'Error',
  },
  message,
})

/**
 * Função para aguardar elementos assíncronos
 */
export const waitForElement = (callback, options = {}) => {
  return new Promise((resolve) => {
    const check = () => {
      try {
        const result = callback()
        if (result) {
          resolve(result)
        } else {
          setTimeout(check, 50)
        }
      } catch (error) {
        setTimeout(check, 50)
      }
    }
    check()
  })
}

/**
 * Função para simular delay
 */
export const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Função para limpar todos os mocks
 */
export const clearAllMocks = () => {
  jest.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
}

/**
 * Função para simular evento de clique
 */
export const fireClick = (element) => {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

/**
 * Função para simular evento de mudança
 */
export const fireChange = (element, value) => {
  element.value = value
  element.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Função para simular evento de submit
 */
export const fireSubmit = (element) => {
  element.dispatchEvent(new Event('submit', { bubbles: true }))
}

// Re-exporta tudo do testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event' 
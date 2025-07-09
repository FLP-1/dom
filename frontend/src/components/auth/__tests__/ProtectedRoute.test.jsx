/**
 * @fileoverview Testes do componente ProtectedRoute
 * @directory src/components/auth/__tests__
 * @description Testes unitários para o componente de proteção de rotas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import ProtectedRoute from '../ProtectedRoute'

// Mock do Next.js router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/dashboard',
    back: jest.fn()
  })
}))

// Mock do hook useAuth
const mockUseAuth = jest.fn()
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock do tema
jest.mock('../../../theme/profile-themes', () => ({
  getProfileTheme: () => ({
    primaryColor: '#1976d2',
    primaryDarkColor: '#1565c0'
  })
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('quando está carregando', () => {
    it('deve mostrar loading', () => {
      mockUseAuth.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        user: null
      })

      render(
        <ProtectedRoute>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })
  })

  describe('quando não requer autenticação', () => {
    it('deve renderizar o conteúdo normalmente', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: false,
        user: null
      })

      render(
        <ProtectedRoute requireAuth={false}>
          <div>Conteúdo público</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Conteúdo público')).toBeInTheDocument()
    })
  })

  describe('quando não está autenticado', () => {
    it('deve redirecionar para login', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: false,
        user: null
      })

      render(
        <ProtectedRoute>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('quando está autenticado sem perfis específicos', () => {
    it('deve renderizar o conteúdo normalmente', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        user: { profile: 'empregador' },
        hasPermission: () => true
      })

      render(
        <ProtectedRoute>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
    })
  })

  describe('quando tem permissão para a rota', () => {
    it('deve renderizar o conteúdo normalmente', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        user: { profile: 'empregador' },
        hasPermission: () => true
      })

      render(
        <ProtectedRoute allowedProfiles={['empregador', 'admin']}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
    })
  })

  describe('quando não tem permissão', () => {
    it('deve mostrar página de acesso negado', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        user: { profile: 'empregado' },
        hasPermission: () => false
      })

      render(
        <ProtectedRoute allowedProfiles={['empregador', 'admin']}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Acesso Negado')).toBeInTheDocument()
      expect(screen.getByText('Você não tem permissão para acessar esta página.')).toBeInTheDocument()
      expect(screen.getByText(/Seu perfil:/)).toBeInTheDocument()
      expect(screen.getByText(/Perfis permitidos:/)).toBeInTheDocument()
    })

    it('deve mostrar botões de ação', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        user: { profile: 'empregado' },
        hasPermission: () => false
      })

      render(
        <ProtectedRoute allowedProfiles={['empregador', 'admin']}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Voltar')).toBeInTheDocument()
      expect(screen.getByText('Ir para Dashboard')).toBeInTheDocument()
    })
  })

  describe('com fallback customizado', () => {
    it('deve renderizar o fallback quando não tem permissão', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        user: { profile: 'empregado' },
        hasPermission: () => false
      })

      const CustomFallback = () => <div>Fallback customizado</div>

      render(
        <ProtectedRoute 
          allowedProfiles={['empregador', 'admin']}
          fallback={<CustomFallback />}
        >
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Fallback customizado')).toBeInTheDocument()
      expect(screen.queryByText('Acesso Negado')).not.toBeInTheDocument()
    })
  })

  describe('quando o usuário não tem perfil definido', () => {
    it('deve mostrar perfil como "Não definido"', () => {
      mockUseAuth.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        user: {},
        hasPermission: () => false
      })

      render(
        <ProtectedRoute allowedProfiles={['empregador', 'admin']}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      )

      expect(screen.getByText(/Seu perfil:/)).toBeInTheDocument()
    })
  })
}) 
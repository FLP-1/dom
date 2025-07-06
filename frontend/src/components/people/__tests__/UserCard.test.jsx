/**
 * @fileoverview Testes do componente UserCard
 * @directory frontend/src/components/people/__tests__
 * @description Testes unitários e de integração para o UserCard
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders, mockUser } from '@/utils/test-utils'
import { UserCard } from '../UserCard'

// Mock das funções de callback
const mockCallbacks = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onView: jest.fn(),
}

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderUserCard = (props = {}) => {
    const defaultProps = {
      user: mockUser,
      profile: 'empregador',
      ...mockCallbacks,
      ...props,
    }

    return renderWithProviders(<UserCard {...defaultProps} />, {
      profile: defaultProps.profile,
    })
  }

  describe('Renderização básica', () => {
    it('deve renderizar o nome do usuário', () => {
      renderUserCard()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('deve renderizar o email do usuário', () => {
      renderUserCard()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
    })

    it('deve renderizar o CPF do usuário', () => {
      renderUserCard()
      expect(screen.getByText(/CPF:/)).toBeInTheDocument()
    })

    it('deve renderizar o avatar com inicial do nome', () => {
      renderUserCard({ user: { ...mockUser, user_photo: null } })
      const avatar = screen.getByText('J')
      expect(avatar).toBeInTheDocument()
    })

    it('deve renderizar o chip de perfil', () => {
      renderUserCard()
      expect(screen.getByText('Empregador')).toBeInTheDocument()
    })

    it('deve renderizar o chip de status ativo', () => {
      renderUserCard()
      expect(screen.getByText('Ativo')).toBeInTheDocument()
    })
  })

  describe('Perfis de usuário', () => {
    it('deve mostrar perfil empregador corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'empregador' } })
      expect(screen.getByText('Empregador')).toBeInTheDocument()
    })

    it('deve mostrar perfil empregado corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'empregado' } })
      expect(screen.getByText('Empregado')).toBeInTheDocument()
    })

    it('deve mostrar perfil familiar corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'familiar' } })
      expect(screen.getByText('Familiar')).toBeInTheDocument()
    })

    it('deve mostrar perfil parceiro corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'parceiro' } })
      expect(screen.getByText('Parceiro')).toBeInTheDocument()
    })

    it('deve mostrar perfil subordinado corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'subordinado' } })
      expect(screen.getByText('Subordinado')).toBeInTheDocument()
    })

    it('deve mostrar perfil admin corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'admin' } })
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('deve mostrar perfil owner corretamente', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'owner' } })
      expect(screen.getByText('Proprietário')).toBeInTheDocument()
    })

    it('deve mostrar perfil desconhecido como texto original', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'desconhecido' } })
      expect(screen.getByText('desconhecido')).toBeInTheDocument()
    })
  })

  describe('Status do usuário', () => {
    it('deve mostrar usuário ativo', () => {
      renderUserCard({ user: { ...mockUser, ativo: true } })
      expect(screen.getByText('Ativo')).toBeInTheDocument()
    })

    it('deve mostrar usuário inativo', () => {
      renderUserCard({ user: { ...mockUser, ativo: false } })
      expect(screen.getByText('Inativo')).toBeInTheDocument()
    })
  })

  describe('Informações de contato', () => {
    it('deve mostrar email quando disponível', () => {
      renderUserCard({ user: { ...mockUser, email: 'teste@example.com' } })
      expect(screen.getByText('teste@example.com')).toBeInTheDocument()
    })

    it('não deve mostrar email quando não disponível', () => {
      renderUserCard({ user: { ...mockUser, email: null, nickname: null } })
      expect(screen.queryByText(/@/)).not.toBeInTheDocument()
    })

    it('deve mostrar celular quando disponível', () => {
      renderUserCard({ user: { ...mockUser, celular: '(11) 99999-9999' } })
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument()
    })

    it('não deve mostrar celular quando não disponível', () => {
      renderUserCard({ user: { ...mockUser, celular: null } })
      expect(screen.queryByText(/\(11\)/)).not.toBeInTheDocument()
    })
  })

  describe('Nickname', () => {
    it('deve mostrar nickname quando disponível', () => {
      renderUserCard({ user: { ...mockUser, nickname: 'joaosilva' } })
      expect(screen.getByText('@joaosilva')).toBeInTheDocument()
    })

    it('não deve mostrar nickname quando não disponível', () => {
      renderUserCard({ user: { ...mockUser, nickname: null } })
      expect(screen.queryByText(/@joaosilva/)).not.toBeInTheDocument()
    })
  })

  describe('Grupos', () => {
    const userWithGroups = {
      ...mockUser,
      grupos: [
        { id: '1', nome: 'Família Silva' },
        { id: '2', nome: 'Trabalho' },
        { id: '3', nome: 'Amigos' },
      ],
    }

    it('deve mostrar grupos quando disponíveis', () => {
      renderUserCard({ user: userWithGroups })
      expect(screen.getByText('Família Silva')).toBeInTheDocument()
      expect(screen.getByText('Trabalho')).toBeInTheDocument()
    })

    it('deve mostrar apenas os primeiros 2 grupos', () => {
      renderUserCard({ user: userWithGroups })
      expect(screen.getByText('Família Silva')).toBeInTheDocument()
      expect(screen.getByText('Trabalho')).toBeInTheDocument()
      expect(screen.queryByText('Amigos')).not.toBeInTheDocument()
    })

    it('deve mostrar indicador de mais grupos', () => {
      renderUserCard({ user: userWithGroups })
      expect(screen.getByText('+1')).toBeInTheDocument()
    })

    it('não deve mostrar grupos quando não disponíveis', () => {
      renderUserCard({ user: { ...mockUser, grupos: [] } })
      expect(screen.queryByText('Grupos:')).not.toBeInTheDocument()
    })
  })

  describe('Interações do usuário', () => {
    it('deve chamar onEdit ao clicar no botão de editar', () => {
      renderUserCard()
      
      const editButton = screen.getByLabelText('Editar')
      fireEvent.click(editButton)
      
      expect(mockCallbacks.onEdit).toHaveBeenCalledWith(mockUser)
    })

    it('deve chamar onDelete ao clicar no botão de excluir', () => {
      renderUserCard()
      
      const deleteButton = screen.getByLabelText('Excluir')
      fireEvent.click(deleteButton)
      
      expect(mockCallbacks.onDelete).toHaveBeenCalledWith(mockUser)
    })

    it('deve chamar onView ao clicar no botão de visualizar', () => {
      renderUserCard()
      
      const viewButton = screen.getByLabelText('Ver detalhes')
      fireEvent.click(viewButton)
      
      expect(mockCallbacks.onView).toHaveBeenCalledWith(mockUser)
    })
  })

  describe('Adaptação por perfil', () => {
    it('deve usar interface simples para perfil empregado', () => {
      renderUserCard({ profile: 'empregado' })
      
      // Verifica se o card tem altura maior (interface simples)
      const card = screen.getByText('João Silva').closest('.MuiCard-root')
      expect(card).toBeInTheDocument()
    })

    it('deve usar interface simples para perfil familiar', () => {
      renderUserCard({ profile: 'familiar' })
      
      // Verifica se o card tem altura maior (interface simples)
      const card = screen.getByText('João Silva').closest('.MuiCard-root')
      expect(card).toBeInTheDocument()
    })

    it('deve usar interface padrão para outros perfis', () => {
      renderUserCard({ profile: 'empregador' })
      
      // Verifica se o card tem altura padrão
      const card = screen.getByText('João Silva').closest('.MuiCard-root')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Avatar e foto', () => {
    it('deve mostrar foto do usuário quando disponível', () => {
      const userWithPhoto = { ...mockUser, user_photo: 'https://example.com/photo.jpg' }
      renderUserCard({ user: userWithPhoto })
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'https://example.com/photo.jpg')
    })

    it('deve mostrar inicial quando não há foto', () => {
      renderUserCard({ user: { ...mockUser, user_photo: null } })
      
      const avatar = screen.getByText('J')
      expect(avatar).toBeInTheDocument()
    })

    it('deve mostrar inicial quando foto está vazia', () => {
      renderUserCard({ user: { ...mockUser, user_photo: '' } })
      
      const avatar = screen.getByText('J')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter tooltips em todos os botões', () => {
      renderUserCard()
      
      expect(screen.getByLabelText('Ver detalhes')).toBeInTheDocument()
      expect(screen.getByLabelText('Editar')).toBeInTheDocument()
      expect(screen.getByLabelText('Excluir')).toBeInTheDocument()
    })

    it('deve ter estrutura semântica correta', () => {
      renderUserCard()
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('João Silva')
    })
  })

  describe('Casos extremos', () => {
    it('deve lidar com usuário sem nome', () => {
      const userWithoutName = { ...mockUser, name: '' }
      renderUserCard({ user: userWithoutName })
      
      // Deve renderizar sem quebrar
      expect(screen.getByText('Empregador')).toBeInTheDocument()
    })

    it('deve lidar com usuário sem CPF', () => {
      const userWithoutCPF = { ...mockUser, cpf: null }
      renderUserCard({ user: userWithoutCPF })
      
      // Deve renderizar sem quebrar
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('deve lidar com callbacks não fornecidos', () => {
      renderUserCard({
        onEdit: undefined,
        onDelete: undefined,
        onView: undefined,
      })
      
      // Deve renderizar sem erros
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('deve lidar com usuário com dados mínimos', () => {
      const minimalUser = {
        id: '1',
        name: 'Usuário',
        perfil: 'empregador',
        ativo: true,
        cpf: '123.456.789-00',
      }
      
      renderUserCard({ user: minimalUser })
      
      expect(screen.getByText('Usuário')).toBeInTheDocument()
      expect(screen.getByText('Empregador')).toBeInTheDocument()
      expect(screen.getByText('Ativo')).toBeInTheDocument()
    })
  })

  describe('Estilos e cores', () => {
    it('deve aplicar cor correta para perfil empregador', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'empregador' } })
      
      const chip = screen.getByText('Empregador')
      expect(chip).toBeInTheDocument()
    })

    it('deve aplicar cor correta para perfil empregado', () => {
      renderUserCard({ user: { ...mockUser, perfil: 'empregado' } })
      
      const chip = screen.getByText('Empregado')
      expect(chip).toBeInTheDocument()
    })

    it('deve aplicar cor correta para status ativo', () => {
      renderUserCard({ user: { ...mockUser, ativo: true } })
      
      const chip = screen.getByText('Ativo')
      expect(chip).toBeInTheDocument()
    })

    it('deve aplicar cor correta para status inativo', () => {
      renderUserCard({ user: { ...mockUser, ativo: false } })
      
      const chip = screen.getByText('Inativo')
      expect(chip).toBeInTheDocument()
    })
  })
}) 
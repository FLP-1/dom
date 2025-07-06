/**
 * @fileoverview Teste de componente simples
 * @directory src/components/__tests__
 * @description Teste básico para validar renderização de componentes
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Assistant
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Componente simples para teste
const SimpleButton = ({ onClick, children, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} data-testid="simple-button">
    {children}
  </button>
)

const SimpleCard = ({ title, content, onCardClick }) => (
  <div 
    onClick={onCardClick} 
    data-testid="simple-card"
    style={{ padding: '16px', border: '1px solid #ccc', cursor: 'pointer' }}
  >
    <h3 data-testid="card-title">{title}</h3>
    <p data-testid="card-content">{content}</p>
  </div>
)

describe('Componentes Simples', () => {
  describe('SimpleButton', () => {
    it('deve renderizar corretamente', () => {
      render(<SimpleButton>Clique aqui</SimpleButton>)
      
      const button = screen.getByTestId('simple-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Clique aqui')
    })

    it('deve chamar onClick quando clicado', () => {
      const handleClick = jest.fn()
      render(<SimpleButton onClick={handleClick}>Clique aqui</SimpleButton>)
      
      const button = screen.getByTestId('simple-button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('deve estar desabilitado quando disabled=true', () => {
      render(<SimpleButton disabled={true}>Clique aqui</SimpleButton>)
      
      const button = screen.getByTestId('simple-button')
      expect(button).toBeDisabled()
    })

    it('deve estar habilitado por padrão', () => {
      render(<SimpleButton>Clique aqui</SimpleButton>)
      
      const button = screen.getByTestId('simple-button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('SimpleCard', () => {
    it('deve renderizar título e conteúdo', () => {
      render(
        <SimpleCard 
          title="Título do Card" 
          content="Conteúdo do card aqui"
        />
      )
      
      expect(screen.getByTestId('card-title')).toHaveTextContent('Título do Card')
      expect(screen.getByTestId('card-content')).toHaveTextContent('Conteúdo do card aqui')
    })

    it('deve chamar onCardClick quando clicado', () => {
      const handleCardClick = jest.fn()
      render(
        <SimpleCard 
          title="Título" 
          content="Conteúdo"
          onCardClick={handleCardClick}
        />
      )
      
      const card = screen.getByTestId('simple-card')
      fireEvent.click(card)
      
      expect(handleCardClick).toHaveBeenCalledTimes(1)
    })

    it('deve ter cursor pointer', () => {
      render(<SimpleCard title="Título" content="Conteúdo" />)
      
      const card = screen.getByTestId('simple-card')
      expect(card).toHaveStyle('cursor: pointer')
    })
  })

  describe('Interações', () => {
    it('deve permitir múltiplos cliques', () => {
      const handleClick = jest.fn()
      render(<SimpleButton onClick={handleClick}>Clique aqui</SimpleButton>)
      
      const button = screen.getByTestId('simple-button')
      
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('deve renderizar múltiplos componentes', () => {
      render(
        <div>
          <SimpleButton>Botão 1</SimpleButton>
          <SimpleButton>Botão 2</SimpleButton>
          <SimpleCard title="Card 1" content="Conteúdo 1" />
          <SimpleCard title="Card 2" content="Conteúdo 2" />
        </div>
      )
      
      const buttons = screen.getAllByTestId('simple-button')
      const cards = screen.getAllByTestId('simple-card')
      
      expect(buttons).toHaveLength(2)
      expect(cards).toHaveLength(2)
      expect(buttons[0]).toHaveTextContent('Botão 1')
      expect(buttons[1]).toHaveTextContent('Botão 2')
    })
  })
}) 
/**
 * @fileoverview Teste simples para verificar configuração
 * @directory frontend/src/components/__tests__
 * @description Teste básico para validar configuração do Jest
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { renderWithProviders } from '@/utils/test-utils'

// Componente simples para teste
const SimpleComponent = ({ title, children }) => (
  <div>
    <h1>{title}</h1>
    <p>{children}</p>
  </div>
)

describe('Teste Simples', () => {
  it('deve renderizar componente básico', () => {
    render(
      <SimpleComponent title="Teste">
        Conteúdo
      </SimpleComponent>
    )
    
    expect(screen.getByText('Teste')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('deve renderizar com providers', () => {
    renderWithProviders(
      <SimpleComponent title="Teste com Providers">
        Conteúdo
      </SimpleComponent>,
      { profile: 'empregador' }
    )
    
    expect(screen.getByText('Teste com Providers')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('deve funcionar com diferentes perfis', () => {
    const profiles = ['empregador', 'empregado', 'familiar']
    
    profiles.forEach(profile => {
      const { unmount } = renderWithProviders(
        <SimpleComponent title={`Teste ${profile}`}>
          Conteúdo
        </SimpleComponent>,
        { profile }
      )
      
      expect(screen.getByText(`Teste ${profile}`)).toBeInTheDocument()
      unmount()
    })
  })
})

describe('Configuração Jest', () => {
  it('deve ter jest-dom configurado', () => {
    const element = document.createElement('div')
    element.innerHTML = '<span>Teste</span>'
    
    expect(element.querySelector('span')).toBeTruthy()
    expect(element.querySelector('span').textContent).toBe('Teste')
  })

  it('deve ter mocks globais funcionando', () => {
    expect(global.fetch).toBeDefined()
    expect(global.localStorage).toBeDefined()
    expect(global.sessionStorage).toBeDefined()
  })
}) 
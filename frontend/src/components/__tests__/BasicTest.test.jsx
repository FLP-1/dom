/**
 * @fileoverview Teste básico para validar configuração
 * @directory src/components/__tests__
 * @description Teste simples para validar se Jest e React Testing Library estão funcionando
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Assistant
 */

import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Teste Básico', () => {
  it('deve renderizar um componente simples', () => {
    const TestComponent = () => <div>Teste funcionando</div>
    
    render(<TestComponent />)
    
    expect(screen.getByText('Teste funcionando')).toBeInTheDocument()
  })

  it('deve fazer operações matemáticas básicas', () => {
    expect(2 + 2).toBe(4)
    expect(10 - 5).toBe(5)
    expect(3 * 4).toBe(12)
  })

  it('deve validar strings', () => {
    const texto = 'DOM v1'
    expect(texto).toContain('DOM')
    expect(texto).toHaveLength(6)
  })
}) 
/**
 * @fileoverview Contexto global para contexto ativo (grupo/perfil)
 * @directory src/context
 * @description Permite acessar e atualizar o contexto ativo do usuário logado
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ContextOption } from '@/components/ContextSelectModal'

export interface ActiveContextType extends ContextOption {
  setActiveContext: (ctx: ContextOption) => void
  refreshTrigger: number
  triggerRefresh: () => void
}

const ActiveContext = createContext<ActiveContextType | undefined>(undefined)

export const ActiveContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [active, setActive] = useState<ContextOption | undefined>(undefined)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Carregar contexto ativo do localStorage na inicialização
  useEffect(() => {
    const savedContext = localStorage.getItem('activeContext')
    if (savedContext) {
      try {
        const parsedContext = JSON.parse(savedContext)
        setActive(parsedContext)
      } catch (error) {
        console.error('Erro ao carregar contexto ativo do localStorage:', error)
        localStorage.removeItem('activeContext')
      }
    }
  }, [])

  // Função para atualizar contexto e persistir no localStorage
  const setActiveContext = (ctx: ContextOption) => {
    setActive(ctx)
    localStorage.setItem('activeContext', JSON.stringify(ctx))
  }

  // Função para forçar refresh dos componentes
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <ActiveContext.Provider value={{ ...active, setActiveContext, refreshTrigger, triggerRefresh } as ActiveContextType}>
      {children}
    </ActiveContext.Provider>
  )
}

export const useActiveContext = () => {
  const ctx = useContext(ActiveContext)
  if (!ctx) throw new Error('useActiveContext deve ser usado dentro do ActiveContextProvider')
  return ctx
} 
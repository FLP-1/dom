/**
 * @fileoverview Contexto global de usuário
 * @directory src/context
 * @description Fornece o usuário logado e perfil para todo o app
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 UserContext Debug: Iniciando carregamento...')
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
    const data = typeof window !== 'undefined' ? localStorage.getItem('userData') : null
    
    console.log('🔍 UserContext Debug:', { token: !!token, data: !!data })
    
    // Só carregar dados do usuário se há token válido
    if (token && data) {
      try {
        const userData = JSON.parse(data)
        console.log('🔍 UserContext Debug: Dados do usuário carregados:', userData)
        setUser(userData)
      } catch (error) {
        console.error('❌ UserContext Debug: Erro ao carregar dados do usuário:', error)
        // Limpar dados inválidos
        localStorage.removeItem('userData')
        localStorage.removeItem('userToken')
        localStorage.removeItem('activeContext')
      }
    } else {
      console.log('🔍 UserContext Debug: Sem token ou dados, limpando localStorage')
      // Limpar dados se não há token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData')
        localStorage.removeItem('activeContext')
      }
    }
    setLoading(false)
    console.log('🔍 UserContext Debug: Carregamento finalizado')
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext) 
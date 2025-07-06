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
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
    const data = typeof window !== 'undefined' ? localStorage.getItem('userData') : null
    
    // Só carregar dados do usuário se há token válido
    if (token && data) {
      try {
        const userData = JSON.parse(data)
        setUser(userData)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        // Limpar dados inválidos
        localStorage.removeItem('userData')
        localStorage.removeItem('userToken')
        localStorage.removeItem('activeContext')
      }
    } else {
      // Limpar dados se não há token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData')
        localStorage.removeItem('activeContext')
      }
    }
    setLoading(false)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext) 
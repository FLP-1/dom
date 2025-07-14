/**
 * @fileoverview Contexto global de usuário e contexto ativo
 * @directory src/context
 * @description Gerencia usuário logado e contexto ativo de forma sincronizada
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Cursor AI
 */
import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [activeContext, setActiveContext] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('userData')
    const storedContext = localStorage.getItem('activeContext')
    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedContext) setActiveContext(JSON.parse(storedContext))
    setLoading(false)
  }, [])

  // Sincronizar user/contexto no localStorage sempre que mudar
  useEffect(() => {
    if (user) localStorage.setItem('userData', JSON.stringify(user))
    if (activeContext) localStorage.setItem('activeContext', JSON.stringify(activeContext))
  }, [user, activeContext])

  // Função para login: atualiza user e contexto
  const login = (userData, contextData) => {
    setUser(userData)
    setActiveContext(contextData)
  }

  // Função para troca de contexto
  const changeContext = (contextData) => {
    setActiveContext(contextData)
    // Se necessário, atualize user também (ex: perfil mudou)
    // setUser({...user, profile: contextData.profile})
  }

  // Função para logout
  const logout = () => {
    setUser(null)
    setActiveContext(null)
    localStorage.removeItem('userData')
    localStorage.removeItem('activeContext')
  }

  return (
    <UserContext.Provider value={{
      user,
      activeContext,
      setUser,
      setActiveContext: changeContext,
      login,
      logout,
      loading
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext) 
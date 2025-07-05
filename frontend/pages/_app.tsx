import '../styles/globals.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/theme'
import { appWithTranslation } from 'next-i18next'
import { UserProvider, useUser } from '@/context/UserContext'
import { ActiveContextProvider, useActiveContext } from '@/context/ActiveContext'
import ContextSelectModal, { ContextOption } from '@/components/ContextSelectModal'
import { useEffect, useState } from 'react'
import { logout } from '@/logout'
import { useRouter } from 'next/router'

function ContextSelectorWrapper({ children }) {
  const { user, setUser, loading } = useUser()
  const { setActiveContext, groupId, groupName, role, profile, triggerRefresh } = useActiveContext()
  const [options, setOptions] = useState<ContextOption[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  // Função para buscar contextos e decidir se mostrar modal
  const fetchContextsAndShowModal = async () => {
    const token = localStorage.getItem('userToken')
    
    if (!token) {
      console.log('ContextSelectorWrapper: Sem token, não buscando contextos')
      return;
    }
    
    console.log('ContextSelectorWrapper: Buscando contextos...')
    
    try {
      const res = await fetch('/api/auth/contexts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.status === 401) {
        console.log('ContextSelectorWrapper: Token inválido, fazendo logout')
        logout()
        return
      }
      
      const response = await res.json()
      console.log('ContextSelectorWrapper: Resposta da API:', response)
      
      if (response.success && response.contexts) {
        setOptions(response.contexts)
        
        // Verificar se já existe um contexto ativo válido
        const hasActiveContext = groupId && groupName && role && profile
        console.log('ContextSelectorWrapper: Contexto ativo:', { groupId, groupName, role, profile })
        console.log('ContextSelectorWrapper: Tem contexto ativo?', hasActiveContext)
        console.log('ContextSelectorWrapper: Número de contextos:', response.contexts.length)
        
        if (response.contexts.length > 1 && !hasActiveContext) {
          console.log('ContextSelectorWrapper: Abrindo modal (múltiplos contextos, sem contexto ativo)')
          setModalOpen(true)
        } else if (response.contexts.length === 1) {
          console.log('ContextSelectorWrapper: Definindo contexto único')
          setActiveContext(response.contexts[0])
        } else if (response.contexts.length > 1 && hasActiveContext) {
          console.log('ContextSelectorWrapper: Múltiplos contextos disponíveis, mas já há contexto ativo')
        }
      }
    } catch (error) {
      console.error('ContextSelectorWrapper: Erro ao buscar contextos:', error)
    }
  }

  // Função para forçar exibição do modal (usada pelo botão "Trocar contexto")
  const forceShowModal = async () => {
    const token = localStorage.getItem('userToken')
    
    if (!token) {
      console.log('forceShowModal: Sem token')
      return;
    }
    
    console.log('forceShowModal: Forçando exibição do modal...')
    
    try {
      const res = await fetch('/api/auth/contexts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.status === 401) {
        console.log('forceShowModal: Token inválido, fazendo logout')
        logout()
        return
      }
      
      const response = await res.json()
      console.log('forceShowModal: Resposta da API:', response)
      
      if (response.success && response.contexts) {
        setOptions(response.contexts)
        console.log('forceShowModal: Abrindo modal com', response.contexts.length, 'contextos')
        setModalOpen(true)
      }
    } catch (error) {
      console.error('forceShowModal: Erro ao buscar contextos:', error)
    }
  }

  useEffect(() => {
    // Não fazer nada se:
    // 1. Ainda está carregando
    // 2. Não há usuário
    // 3. Não há token
    // 4. Está na página de login
    if (loading || !user || router.pathname === '/login') {
      return;
    }
    
    fetchContextsAndShowModal()
  }, [user, loading, router.pathname])

  // Expor função para forçar exibição do modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).forceShowContextModal = forceShowModal
    }
  }, [])

  const handleSelect = async (opt: ContextOption) => {
    setActiveContext(opt)
    setModalOpen(false)
    
    try {
      // Atualizar contexto ativo da sessão no backend
      await fetch('/api/auth/session/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ groupId: opt.groupId, role: opt.role })
      })
      
      // Buscar novos dados do usuário
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      if (res.ok) {
        const userData = await res.json()
        localStorage.setItem('userData', JSON.stringify(userData))
        setUser(userData)
      }
      
      // Forçar atualização dos componentes sem recarregar a página
      triggerRefresh()
    } catch (error) {
      console.error('Erro ao atualizar contexto:', error)
      // Em caso de erro, ainda tentar atualizar
      triggerRefresh()
    }
  }

  return <>
    <ContextSelectModal open={modalOpen} options={options} onSelect={handleSelect} />
    {children}
  </>
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <ActiveContextProvider>
          <ContextSelectorWrapper>
            <Component {...pageProps} />
          </ContextSelectorWrapper>
        </ActiveContextProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp)

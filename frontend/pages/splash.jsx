/**
 * @fileoverview Splash Screen
 * @directory pages
 * @description Tela de carregamento inicial com logo e animação de execução
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import theme from '@/theme'

const SplashContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden'
}))

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4)
}))

const RotatingCircle = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.primary.main,
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round'
  }
}))

const Logo = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  zIndex: 2,
  position: 'relative'
}))

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
  textAlign: 'center',
  fontWeight: 500
}))

const SplashScreen = () => {
  const router = useRouter()
  const [loadingText, setLoadingText] = useState('Carregando...')

  useEffect(() => {
    // Simula carregamento com textos diferentes
    const loadingMessages = [
      'Carregando...',
      'Preparando sua experiência...',
      'Conectando com o servidor...',
      'Quase pronto...'
    ]

    let messageIndex = 0
    const interval = setInterval(() => {
      setLoadingText(loadingMessages[messageIndex])
      messageIndex = (messageIndex + 1) % loadingMessages.length
    }, 1500)

    // Simula tempo de carregamento e redireciona para login
    const timer = setTimeout(() => {
      clearInterval(interval)
      router.push('/login')
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <SplashContainer>
      <LogoContainer>
        {/* Círculo girando ao redor do logo */}
        <RotatingCircle
          size={160}
          thickness={2}
          aria-label="Carregando aplicação"
        />
        {/* Logo central */}
        <Logo
          src="/Logo_CasaMaoCoracao.png"
          alt="DOM - Logo"
          aria-label="Logo DOM"
        />
      </LogoContainer>
      <LoadingText variant="body1">
        {loadingText}
      </LoadingText>
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: theme.spacing(3),
          color: theme.palette.text.secondary,
          textAlign: 'center'
        }}
      >
        DOM - Conectando pessoas, transformando vidas
      </Typography>
    </SplashContainer>
  )
}

export default SplashScreen 
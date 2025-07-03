/**
 * @fileoverview Home Page
 * @directory pages
 * @description Página inicial que redireciona para splash
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import theme from '@/theme'

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}))

const HomePage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redireciona para splash após um breve delay
    const timer = setTimeout(() => {
      router.push('/splash')
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <LoadingContainer>
      <CircularProgress 
        size={40} 
        color="primary"
        aria-label="Carregando página inicial"
      />
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mt: 2 }}
      >
        Redirecionando...
      </Typography>
    </LoadingContainer>
  )
}

export default HomePage

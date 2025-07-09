/**
 * @fileoverview Componente de rota protegida
 * @directory src/components/auth
 * @description Componente para proteger rotas baseado no perfil do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import { useRouter } from 'next/router'
import { Box, Typography, Card, CardContent, IconButton, CircularProgress, Alert } from '@mui/material'
import { ArrowBack, Dashboard, Login } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { getProfileTheme } from '@/theme/profile-themes'
import { useAuthMessages } from '@/utils/messages/auth'

/**
 * Componente para proteger rotas baseado no perfil do usuário
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado se autorizado
 * @param {string[]} props.allowedProfiles - Perfis permitidos para acessar a rota
 * @param {boolean} props.requireAuth - Se requer autenticação (padrão: true)
 * @param {React.ReactNode} props.fallback - Componente a ser renderizado se não autorizado
 * @returns {React.ReactNode} Componente renderizado
 */
const ProtectedRoute = ({ 
  children, 
  allowedProfiles = [], 
  requireAuth = true,
  fallback = null 
}) => {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const { t } = useAuthMessages()
  
  // Se está carregando, mostrar loading
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="50vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t('loading')}
        </Typography>
      </Box>
    )
  }
  
  // Se não requer autenticação, renderizar normalmente
  if (!requireAuth) {
    return children
  }
  
  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }
  
  // Se não há perfis específicos definidos, permitir acesso
  if (allowedProfiles.length === 0) {
    return children
  }
  
  // Verificar se o usuário tem permissão
  const currentRoute = router.pathname
  const hasRoutePermission = hasPermission(currentRoute)
  const hasProfilePermission = allowedProfiles.includes(user?.profile)
  
  if (!hasRoutePermission || !hasProfilePermission) {
    // Se forneceu um fallback customizado, usar ele
    if (fallback) {
      return fallback
    }
    
    // Fallback padrão: página de acesso negado
    return <AccessDenied user={user} allowedProfiles={allowedProfiles} />
  }
  
  return children
}

/**
 * Componente de acesso negado
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.user - Dados do usuário
 * @param {string[]} props.allowedProfiles - Perfis permitidos
 * @returns {React.ReactNode} Componente de acesso negado
 */
const AccessDenied = ({ user, allowedProfiles }) => {
  const router = useRouter()
  const profileTheme = getProfileTheme(user?.profile || 'empregador')
  const { t } = useAuthMessages()
  
  const handleGoBack = () => {
    router.back()
  }
  
  const handleGoDashboard = () => {
    router.push('/dashboard')
  }
  
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="70vh"
      sx={{ p: 3 }}
    >
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 3, 
          maxWidth: 600,
          '& .MuiAlert-icon': {
            fontSize: '2rem'
          }
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('access_denied')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('no_permission')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('your_profile')} <strong>{user?.profile || t('not_defined')}</strong>
        </Typography>
        {allowedProfiles.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('allowed_profiles')} <strong>{allowedProfiles.join(', ')}</strong>
          </Typography>
        )}
      </Alert>
      
      <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
        <Card 
          sx={{ 
            cursor: 'pointer', 
            m: 1,
            border: `2px solid ${profileTheme.primaryColor}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 20px ${profileTheme.primaryColor}40`,
              borderColor: profileTheme.primaryDarkColor
            }
          }}
          onClick={handleGoBack}
        >
          <CardContent sx={{ textAlign: 'center', p: 3, minWidth: 120 }}>
            <IconButton 
              size="large" 
              sx={{ 
                color: profileTheme.primaryColor,
                mb: 1,
                '&:hover': {
                  backgroundColor: `${profileTheme.primaryColor}20`
                }
              }}
            >
              <ArrowBack fontSize="large" />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('go_back')}
            </Typography>
          </CardContent>
        </Card>
        
        <Card 
          sx={{ 
            cursor: 'pointer', 
            m: 1,
            backgroundColor: profileTheme.primaryColor,
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 20px ${profileTheme.primaryColor}60`,
              backgroundColor: profileTheme.primaryDarkColor
            }
          }}
          onClick={handleGoDashboard}
        >
          <CardContent sx={{ textAlign: 'center', p: 3, minWidth: 120 }}>
            <IconButton 
              size="large" 
              sx={{ 
                color: 'white',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <Dashboard fontSize="large" />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('go_dashboard')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ProtectedRoute 
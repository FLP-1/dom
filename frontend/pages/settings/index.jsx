/**
 * @fileoverview Página de configurações
 * @directory pages/settings
 * @description Página para gerenciar configurações do sistema
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import { useTranslation } from '@/utils/i18n'
import { 
  Box, 
  Typography, 
  Container,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'
import { ProtectedRoute } from '@/components/auth'
import { useUser } from '@/context/UserContext'
import MainLayout from '@/components/MainLayout'
import { getProfileTheme } from '@/theme/profile-themes'

export default function SettingsPage(props) {
  const { t } = useTranslation('common')
  const { activeContext, user } = useUser()
  const profile = activeContext?.profile || user?.profile || 'empregador'
  const theme = getProfileTheme(profile)

  return (
    <MainLayout profile={profile} userName={user?.name || ''} title="Configurações">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <SettingsIcon 
              sx={{ 
                fontSize: '32px', 
                color: theme.primaryColor 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ color: theme.primaryColor }}
            >
              {t('settings.title', 'Configurações')}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('settings.coming_soon', 'Funcionalidade em Desenvolvimento')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('settings.coming_soon_description', 'A página de configurações está sendo desenvolvida e estará disponível em breve.')}
                </Typography>
                <Box mt={2}>
                  <Chip 
                    label={t('settings.status_development', 'Em Desenvolvimento')} 
                    color="warning" 
                    variant="outlined" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  )
} 
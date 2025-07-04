/**
 * @fileoverview Página de configurações
 * @directory pages/settings
 * @description Página para gerenciar configurações do sistema
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { 
  Box, 
  Typography, 
  Container,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function SettingsPage() {
  const { t } = useTranslation('common')

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {t('settings.title', 'Configurações')}
        </Typography>
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
  )
} 
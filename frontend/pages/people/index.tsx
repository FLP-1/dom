/**
 * @fileoverview Página de listagem de pessoas
 * @directory pages/people
 * @description Página para visualizar e gerenciar pessoas do sistema
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
  Button,
  Chip
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function PeoplePage() {
  const { t } = useTranslation('common')

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {t('people.title', 'Pessoas')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/people/new'}
        >
          {t('people.add_new', 'Nova Pessoa')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('people.coming_soon', 'Funcionalidade em Desenvolvimento')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('people.coming_soon_description', 'A página de pessoas está sendo desenvolvida e estará disponível em breve.')}
              </Typography>
              <Box mt={2}>
                <Chip 
                  label={t('people.status_development', 'Em Desenvolvimento')} 
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
/**
 * @fileoverview Página de listagem de tarefas
 * @directory pages/tasks
 * @description Página para visualizar e gerenciar tarefas do sistema
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

export default function TasksPage() {
  const { t } = useTranslation('common')

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {t('tasks.title', 'Tarefas')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/tasks/new'}
        >
          {t('tasks.add_new', 'Nova Tarefa')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('tasks.coming_soon', 'Funcionalidade em Desenvolvimento')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('tasks.coming_soon_description', 'A página de tarefas está sendo desenvolvida e estará disponível em breve.')}
              </Typography>
              <Box mt={2}>
                <Chip 
                  label={t('tasks.status_development', 'Em Desenvolvimento')} 
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
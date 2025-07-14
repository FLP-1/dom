/**
 * @fileoverview Página de criação de nova tarefa
 * @directory pages/tasks
 * @description Página para criar uma nova tarefa no sistema
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
  Button,
  Chip
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import MainLayout from '@/components/MainLayout'
import { useUser } from '@/context/UserContext'
import { ProtectedRoute } from '@/components/auth'



export default function NewTaskPage() {
  const { t } = useTranslation('common')
  const { activeContext, user } = useUser()
  const profile = activeContext?.profile || user?.profile || 'empregador'

  return (
    <ProtectedRoute allowedProfiles={['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']}>
      <MainLayout profile={profile}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{ mr: 2 }}
        >
          {t('common.back', 'Voltar')}
        </Button>
        <Typography variant="h4" component="h1">
          {t('tasks.new_task', 'Nova Tarefa')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('tasks.coming_soon', 'Funcionalidade em Desenvolvimento')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('tasks.new_task_coming_soon', 'A funcionalidade de criação de tarefas está sendo desenvolvida e estará disponível em breve.')}
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
      </MainLayout>
    </ProtectedRoute>
  )
} 
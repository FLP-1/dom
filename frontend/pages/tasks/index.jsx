/**
 * @fileoverview Página de Tarefas
 * @directory pages/tasks
 * @description Tela principal de tarefas com visual moderno, filtros avançados, cards de resumo e responsáveis integrados
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { Box, Container, Typography, Grid, IconButton, Tooltip, Avatar, Button, Chip, Fade, Snackbar, Fab, Card, CardContent, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import { getProfileTheme, getProfileCardStyle } from '@/theme/profile-themes'
import TaskFilters from '@/components/tasks/TaskFilters'
import TaskCard from '@/components/tasks/TaskCard'
import MainLayout from '@/components/MainLayout'

import { useUser } from '@/context/UserContext'
import WarningIcon from '@mui/icons-material/Warning'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TaskStatsCards from '@/components/tasks/TaskStatsCards'
import { useTasks } from '@/hooks/useTasks'
import { useTaskStats } from '@/hooks/useTaskStats'
import { useUsers } from '@/hooks/useUsers'
import { ProtectedRoute } from '@/components/auth'



const PERIODS = ['today', 'week', 'month', 'custom']
const STATUS = ['pending', 'in_progress', 'completed', 'cancelled', 'paused']

const TasksPage = () => {
  const theme = useTheme()
  const { user, loading } = useUser()
  const { activeContext } = useUser()
  const groupId = activeContext?.groupId
  const groupName = activeContext?.groupName
  const role = activeContext?.role
  const activeProfile = activeContext?.profile
  const refreshTrigger = activeContext?.refreshTrigger
  const [filter, setFilter] = useState({})
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [period, setPeriod] = useState('today')
  const [status, setStatus] = useState('pending')

  // Usar perfil do contexto ativo se disponível, senão usar perfil do usuário
  const currentProfile = activeProfile || user?.profile || 'empregador'
  const profileTheme = getProfileTheme(currentProfile)

  // Hook para buscar tarefas do backend
  const { tasks, loading: loadingTasks, error: errorTasks } = useTasks(currentProfile, true)

  // Hook para buscar estatísticas do backend
  const { stats, loading: loadingStats, error: errorStats } = useTaskStats(currentProfile)

  // Hook para buscar usuários (responsáveis)
  const { users: responsaveis, loading: loadingUsers, error: errorUsers } = useUsers({ 
    token: user?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null), 
    params: { profile: currentProfile } 
  })

  // Recarregar dados quando o contexto mudar ou quando refreshTrigger for acionado
  useEffect(() => {
    if (groupId && groupName && role) {
      console.log('Contexto ativo mudou:', { groupId, groupName, role, profile: activeProfile })
      // Aqui você pode adicionar lógica para recarregar dados específicos do contexto
    }
  }, [groupId, groupName, role, activeProfile]) // Removido refreshTrigger para evitar loop

  // Exibir erros se houver
  useEffect(() => {
    if (errorTasks) {
      setSnackbarMessage(`Erro ao carregar tarefas: ${errorTasks}`)
      setShowSnackbar(true)
    }
  }, [errorTasks])

  useEffect(() => {
    if (errorStats) {
      setSnackbarMessage(`Erro ao carregar estatísticas: ${errorStats}`)
      setShowSnackbar(true)
    }
  }, [errorStats])

  useEffect(() => {
    if (errorUsers) {
      setSnackbarMessage(`Erro ao carregar responsáveis: ${errorUsers}`)
      setShowSnackbar(true)
    }
  }, [errorUsers])

  // Função para filtrar por período
  const isInPeriod = useCallback((date) => {
    if (!date) return false
    const now = new Date()
    if (period === 'today') {
      return date.toDateString() === now.toDateString()
    }
    if (period === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return date >= weekAgo && date <= now
    }
    if (period === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }
    // custom: mostrar tudo (ou implementar intervalo customizado futuramente)
    return true
  }, [period])

  // Filtrar tarefas (agora usando dados reais do backend)
  const filteredTarefas = useMemo(() => {
    if (!tasks) return []
    
    return tasks.filter(tarefa => {
      // Filtrar por período (filtro local)
      if (!isInPeriod(tarefa.data_limite ? new Date(tarefa.data_limite) : undefined)) {
        return false
      }
      
      // Filtrar por prioridade (filtro local)
      if (filter.priority?.length && !filter.priority.includes(tarefa.prioridade.toString())) {
        return false
      }
      
      // Filtrar por busca (filtro local)
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const searchableText = [
          tarefa.titulo,
          tarefa.descricao || '',
          tarefa.categoria || '',
          ...(tarefa.tags || [])
        ].join(' ').toLowerCase()
        if (!searchableText.includes(searchLower)) {
          return false
        }
      }
      
      return true
    }).sort((a, b) => {
      // Ordenar por data limite
      if (a.data_limite && b.data_limite) {
        return new Date(a.data_limite).getTime() - new Date(b.data_limite).getTime()
      }
      if (a.data_limite) return -1
      if (b.data_limite) return 1
      
      // Ordenar por prioridade
      const priorityOrder = { 3: 4, 2: 3, 1: 2 }
      return priorityOrder[b.prioridade] - priorityOrder[a.prioridade]
    })
  }, [tasks, filter, isInPeriod])

  const handleEditTask = (task) => {
    setSnackbarMessage(`Editando tarefa: ${task.title}`)
    setShowSnackbar(true)
  }
  const handleDeleteTask = (taskId) => {
    setSnackbarMessage('Tarefa excluída com sucesso!')
    setShowSnackbar(true)
  }
  const handleToggleStatus = (taskId, newStatus) => {
    setSnackbarMessage(`Status da tarefa alterado para: ${newStatus}`)
    setShowSnackbar(true)
  }
  const handlePhotoUpload = (taskId) => {
    setSnackbarMessage('Funcionalidade de upload de foto em desenvolvimento!')
    setShowSnackbar(true)
  }
  const handleStatsCardClick = (status) => {
    setFilter(prev => ({ ...prev, status: [status] }))
  }

  // Usar estatísticas do backend ou calcular localmente se não disponível
  const statsUrgentes = {
    total: stats ? stats.tarefas_atrasadas : filteredTarefas.filter(t => t.prioridade === 3 && t.status !== 'completed').length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    overdue: stats ? stats.tarefas_atrasadas : 0,
    completedToday: 0,
    averageCompletionTime: 0
  }
  const statsAConcluir = {
    total: stats ? (stats.tarefas_pendentes + stats.tarefas_em_andamento) : filteredTarefas.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    pending: stats ? stats.tarefas_pendentes : filteredTarefas.filter(t => t.status === 'pending').length,
    inProgress: stats ? stats.tarefas_em_andamento : filteredTarefas.filter(t => t.status === 'in_progress').length,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    completedToday: 0,
    averageCompletionTime: 0
  }
  const statsConcluidasHoje = {
    total: stats ? stats.tarefas_concluidas : filteredTarefas.filter(t => t.status === 'completed' && t.data_limite && new Date(t.data_limite).toDateString() === new Date().toDateString()).length,
    pending: 0,
    inProgress: 0,
    completed: stats ? stats.tarefas_concluidas : filteredTarefas.filter(t => t.status === 'completed').length,
    cancelled: 0,
    overdue: 0,
    completedToday: stats ? stats.tarefas_concluidas : 0,
    averageCompletionTime: 0
  }

  return (
    <ProtectedRoute allowedProfiles={['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']}>
      <MainLayout profile={currentProfile} userName={user?.name || ''} title="Tarefas">
      <Head>
        <title>Tarefas | DOM</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading || loadingTasks || loadingUsers ? (
          <Box p={4} display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
            <Typography ml={2}>Carregando tarefas...</Typography>
          </Box>
        ) : !user ? (
          <Box p={4}><Typography>Usuário não autenticado.</Typography></Box>
        ) : (
          <>
            {/* Cards de resumo */}
            <Grid container spacing={3} mb={4}>
              {/* Card 1: Tarefas Urgentes */}
              <Grid xs={12} sm={4}>
                <Card sx={{
                  ...getProfileCardStyle(currentProfile),
                  background: getProfileCardStyle(currentProfile).background,
                  border: getProfileCardStyle(currentProfile).border,
                  height: 70,
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <WarningIcon sx={{ color: getProfileTheme(currentProfile).primaryColor, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: getProfileTheme(currentProfile).textSize.medium, fontWeight: 600, mr: 1 }}>
                      Tarefas Urgentes
                    </Typography>
                    <Box flex={1} />
                    <Typography variant="h4" color="primary" sx={{ fontSize: getProfileTheme(currentProfile).textSize.xlarge, minWidth: 32, textAlign: 'right', fontWeight: 700 }}>
                      {statsUrgentes.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Card 2: Tarefas a Concluir */}
              <Grid xs={12} sm={4}>
                <Card sx={{
                  ...getProfileCardStyle(currentProfile),
                  background: getProfileCardStyle(currentProfile).background,
                  border: getProfileCardStyle(currentProfile).border,
                  height: 70,
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <AssignmentIcon sx={{ color: getProfileTheme(currentProfile).primaryColor, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: getProfileTheme(currentProfile).textSize.medium, fontWeight: 600, mr: 1 }}>
                      Tarefas a Concluir
                    </Typography>
                    <Box flex={1} />
                    <Typography variant="h4" color="primary" sx={{ fontSize: getProfileTheme(currentProfile).textSize.xlarge, minWidth: 32, textAlign: 'right', fontWeight: 700 }}>
                      {statsAConcluir.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Card 3: Tarefas Concluídas Hoje */}
              <Grid xs={12} sm={4}>
                <Card sx={{
                  ...getProfileCardStyle(currentProfile),
                  background: getProfileCardStyle(currentProfile).background,
                  border: getProfileCardStyle(currentProfile).border,
                  height: 70,
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: getProfileTheme(currentProfile).textSize.medium, fontWeight: 600, mr: 1 }}>
                      Tarefas Concluídas Hoje
                    </Typography>
                    <Box flex={1} />
                    <Typography variant="h4" sx={{ color: '#4caf50', fontSize: getProfileTheme(currentProfile).textSize.xlarge, minWidth: 32, textAlign: 'right', fontWeight: 700 }}>
                      {statsConcluidasHoje.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {/* Filtros */}
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              responsaveis={responsaveis || []}
              profile={currentProfile}
            />
            {/* Lista de tarefas */}
            <Box mb={3}>
              <Typography variant="h6" color={profileTheme.primaryColor} fontWeight={700} mb={2}>
                Tarefas ({filteredTarefas.length})
              </Typography>
              {filteredTarefas.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    Nenhuma tarefa encontrada com os filtros aplicados.
                  </Typography>
                </Box>
              ) : (
                filteredTarefas.map(tarefa => (
                  <Fade in key={tarefa.id}>
                    <Box>
                      <TaskCard
                        task={{
                          id: tarefa.id,
                          title: tarefa.titulo,
                          description: tarefa.descricao || '',
                          status: tarefa.status,
                          priority: tarefa.prioridade === 3 ? 'high' : tarefa.prioridade === 2 ? 'medium' : 'low',
                          dueDate: tarefa.data_limite ? new Date(tarefa.data_limite) : undefined,
                          createdAt: new Date(tarefa.data_criacao),
                          responsibleId: tarefa.responsavel_id || '',
                          category: tarefa.categoria || '',
                          estimatedTime: 0,
                          photos: tarefa.anexos || [],
                          tags: tarefa.tags || []
                        }}
                        responsible={null}
                        profile={user.profile}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleStatus={handleToggleStatus}
                        onPhotoUpload={handlePhotoUpload}
                      />
                    </Box>
                  </Fade>
                ))
              )}
            </Box>
          </>
        )}
      </Container>
      {/* FAB para nova tarefa */}
      <Fab
        color="primary"
        aria-label="Nova tarefa"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: profileTheme.primaryColor
        }}
        onClick={() => {
          setSnackbarMessage('Modal de nova tarefa em desenvolvimento!')
          setShowSnackbar(true)
        }}
      >
        <AddIcon />
      </Fab>
      {/* Snackbar de feedback */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setShowSnackbar(false)} 
        message={snackbarMessage}
      />
    </MainLayout>
    </ProtectedRoute>
  )
}

export default TasksPage 
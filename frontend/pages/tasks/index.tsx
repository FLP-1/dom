/**
 * @fileoverview Página de Tarefas
 * @directory pages/tasks
 * @description Tela principal de tarefas com visual moderno, filtros avançados, cards de resumo e responsáveis integrados
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useState, useMemo, useEffect } from 'react'
import Head from 'next/head'
import { Box, Container, Typography, Grid, IconButton, Tooltip, Avatar, useTheme, Button, Chip, Fade, Snackbar, Fab, Card, CardContent } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import { getProfileTheme, getProfileCardStyle } from '@/theme/profile-themes'
import TaskFilters from '@/components/tasks/TaskFilters'
import TaskCard from '@/components/tasks/TaskCard'
import MainLayout from '@/components/MainLayout'
import { Task, TaskResponsible, TaskFilter, TaskStats } from '@/types/tasks'
import { useUser } from '@/context/UserContext'
import { useActiveContext } from '@/context/ActiveContext'
import WarningIcon from '@mui/icons-material/Warning'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TaskStatsCards from '@/components/tasks/TaskStatsCards'

// Dados mockados para exemplo visual
const mockResponsaveis: TaskResponsible[] = [
  { 
    id: '1', 
    name: 'Maria Silva', 
    nickname: 'Mari', 
    role: 'empregado', 
    avatar: '', 
    email: 'maria@email.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: '2', 
    name: 'Joana Santos', 
    nickname: 'Jo', 
    role: 'empregador', 
    avatar: '', 
    email: 'joana@email.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: '3', 
    name: 'Ana Costa', 
    nickname: 'Aninha', 
    role: 'familiar', 
    avatar: '', 
    email: 'ana@email.com',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockTarefas: Task[] = [
  {
    id: '1',
    title: 'Limpeza da cozinha',
    description: 'Limpar fogão, pia e organizar armários',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
    createdAt: new Date(),
    responsibleId: '1',
    category: 'limpeza',
    estimatedTime: 60,
    photos: []
  },
  {
    id: '2',
    title: 'Lavar roupas',
    description: 'Separar por cor e lavar na máquina',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas
    createdAt: new Date(),
    responsibleId: '2',
    category: 'roupas',
    estimatedTime: 120,
    photos: []
  },
  {
    id: '3',
    title: 'Organizar quarto',
    description: 'Arrumar cama, organizar roupas e limpar',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(),
    createdAt: new Date(),
    responsibleId: '1',
    category: 'organizacao',
    estimatedTime: 45,
    photos: []
  },
  {
    id: '4',
    title: 'Preparar almoço',
    description: 'Fazer arroz, feijão e salada',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hora
    createdAt: new Date(),
    responsibleId: '2',
    category: 'cozinha',
    estimatedTime: 90,
    photos: []
  },
  {
    id: '5',
    title: 'Passar roupas',
    description: 'Passar camisas e calças',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(),
    createdAt: new Date(),
    responsibleId: '1',
    category: 'roupas',
    estimatedTime: 60,
    photos: []
  }
]

const PERIODS = ['today', 'week', 'month', 'custom']
const STATUS = ['pending', 'in_progress', 'completed', 'cancelled', 'paused']

const TasksPage: React.FC = () => {
  const theme = useTheme()
  const { user, loading } = useUser()
  const { groupId, groupName, role, profile: activeProfile, refreshTrigger } = useActiveContext()
  const [filter, setFilter] = useState<TaskFilter>({})
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [period, setPeriod] = useState('today')
  const [status, setStatus] = useState('pending')

  // Usar perfil do contexto ativo se disponível, senão usar perfil do usuário
  const currentProfile = activeProfile || user?.profile || 'empregador'
  const profileTheme = getProfileTheme(currentProfile)

  // Recarregar dados quando o contexto mudar ou quando refreshTrigger for acionado
  useEffect(() => {
    if (groupId && groupName && role) {
      console.log('Contexto ativo mudou:', { groupId, groupName, role, profile: activeProfile })
      // Aqui você pode adicionar lógica para recarregar dados específicos do contexto
    }
  }, [groupId, groupName, role, activeProfile, refreshTrigger])

  // Função para filtrar por período
  const isInPeriod = (date: Date | undefined) => {
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
  }

  // Filtrar tarefas
  const filteredTarefas = useMemo(() => {
    return mockTarefas.filter(tarefa => {
      if (filter.responsibleId?.length && !filter.responsibleId.includes(tarefa.responsibleId)) {
        return false
      }
      if (status && tarefa.status !== status) {
        return false
      }
      if (filter.priority?.length && !filter.priority.includes(tarefa.priority)) {
        return false
      }
      if (!isInPeriod(tarefa.dueDate)) {
        return false
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const searchableText = [
          tarefa.title,
          tarefa.description,
          tarefa.notes,
          ...tarefa.tags
        ].join(' ').toLowerCase()
        if (!searchableText.includes(searchLower)) {
          return false
        }
      }
      return true
    }).sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return b.dueDate.getTime() - a.dueDate.getTime()
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [filter, period, status])

  const handleEditTask = (task: Task) => {
    setSnackbarMessage(`Editando tarefa: ${task.title}`)
    setShowSnackbar(true)
  }
  const handleDeleteTask = (taskId: string) => {
    setSnackbarMessage('Tarefa excluída com sucesso!')
    setShowSnackbar(true)
  }
  const handleToggleStatus = (taskId: string, newStatus: string) => {
    setSnackbarMessage(`Status da tarefa alterado para: ${newStatus}`)
    setShowSnackbar(true)
  }
  const handlePhotoUpload = (taskId: string) => {
    setSnackbarMessage('Funcionalidade de upload de foto em desenvolvimento!')
    setShowSnackbar(true)
  }
  const handleStatsCardClick = (status: string) => {
    setFilter(prev => ({ ...prev, status: [status] }))
  }

  // Gerar TaskStats para cada card
  const statsUrgentes = {
    total: filteredTarefas.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    completedToday: 0,
    averageCompletionTime: 0
  }
  const statsAConcluir = {
    total: filteredTarefas.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    pending: filteredTarefas.filter(t => t.status === 'pending').length,
    inProgress: filteredTarefas.filter(t => t.status === 'in_progress').length,
    completed: 0,
    cancelled: 0,
    overdue: 0,
    completedToday: 0,
    averageCompletionTime: 0
  }
  const statsConcluidasHoje = {
    total: filteredTarefas.filter(t => t.status === 'completed' && t.dueDate?.toDateString() === new Date().toDateString()).length,
    pending: 0,
    inProgress: 0,
    completed: filteredTarefas.filter(t => t.status === 'completed' && t.dueDate?.toDateString() === new Date().toDateString()).length,
    cancelled: 0,
    overdue: 0,
    completedToday: filteredTarefas.filter(t => t.status === 'completed' && t.dueDate?.toDateString() === new Date().toDateString()).length,
    averageCompletionTime: 0
  }

  return (
    <MainLayout profile={currentProfile} userName={user?.name || ''} title="Tarefas">
      <Head>
        <title>Tarefas | DOM</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ? (
          <Box p={4}><Typography>Carregando...</Typography></Box>
        ) : !user ? (
          <Box p={4}><Typography>Usuário não autenticado.</Typography></Box>
        ) : (
          <>
            {/* Cards de resumo */}
            <Grid container spacing={3} mb={4}>
              {/* Card 1: Tarefas Urgentes */}
              <Grid item xs={12} sm={4}>
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
                      {filteredTarefas.filter(t => t.priority === 'high' && t.status !== 'completed').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Card 2: Tarefas a Concluir */}
              <Grid item xs={12} sm={4}>
                <Card sx={{
                  ...getProfileCardStyle(user.profile),
                  background: getProfileCardStyle(user.profile).background,
                  border: getProfileCardStyle(user.profile).border,
                  height: 70,
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <AssignmentIcon sx={{ color: getProfileTheme(user.profile).primaryColor, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: getProfileTheme(user.profile).textSize.medium, fontWeight: 600, mr: 1 }}>
                      Tarefas a Concluir
                    </Typography>
                    <Box flex={1} />
                    <Typography variant="h4" color="primary" sx={{ fontSize: getProfileTheme(user.profile).textSize.xlarge, minWidth: 32, textAlign: 'right', fontWeight: 700 }}>
                      {filteredTarefas.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Card 3: Tarefas Concluídas Hoje */}
              <Grid item xs={12} sm={4}>
                <Card sx={{
                  ...getProfileCardStyle(user.profile),
                  background: getProfileCardStyle(user.profile).background,
                  border: getProfileCardStyle(user.profile).border,
                  height: 70,
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: getProfileTheme(user.profile).textSize.medium, fontWeight: 600, mr: 1 }}>
                      Tarefas Concluídas Hoje
                    </Typography>
                    <Box flex={1} />
                    <Typography variant="h4" sx={{ color: '#4caf50', fontSize: getProfileTheme(user.profile).textSize.xlarge, minWidth: 32, textAlign: 'right', fontWeight: 700 }}>
                      {filteredTarefas.filter(t => t.status === 'completed' && t.dueDate?.toDateString() === new Date().toDateString()).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {/* Filtros */}
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              responsaveis={mockResponsaveis}
              profile={user.profile}
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
                        task={tarefa}
                        responsible={mockResponsaveis.find(r => r.id === tarefa.responsibleId)}
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
  )
}

export default TasksPage 
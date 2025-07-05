/**
 * @fileoverview Card de Tarefa
 * @directory src/components/tasks
 * @description Card completo de tarefa com responsável, descrição, observação, foto, datas e indicativos
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Grid,
  Divider,
  Badge
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Note as NoteIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { Task, TaskResponsible } from '@/types/tasks'
import { getProfileTheme } from '@/theme/profile-themes'

interface TaskCardProps {
  task: Task
  responsible?: TaskResponsible
  profile: string
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onToggleStatus?: (taskId: string, status: string) => void
  onPhotoUpload?: (taskId: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  responsible,
  profile,
  onEdit,
  onDelete,
  onToggleStatus,
  onPhotoUpload
}) => {
  const [expanded, setExpanded] = useState(false)
  const profileTheme = getProfileTheme(profile)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'in_progress': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      case 'paused': return 'info'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'A Fazer'
      case 'in_progress': return 'Iniciada'
      case 'completed': return 'Terminada'
      case 'cancelled': return 'Descartada'
      case 'paused': return 'Reprogramada'
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente'
      case 'high': return 'Alta'
      case 'medium': return 'Normal'
      case 'low': return 'Baixa'
      default: return priority
    }
  }

  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== 'completed'
  const isReprogrammed = task.status === 'paused'

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        border: `2px solid ${isOverdue ? '#FF5722' : isReprogrammed ? '#2196F3' : profileTheme.primaryColor}30`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
          borderColor: isOverdue ? '#FF5722' : isReprogrammed ? '#2196F3' : profileTheme.primaryColor
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header da tarefa */}
        <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
          <Tooltip title={task.status === 'completed' ? 'Concluída' : 'Marcar como concluída'}>
            <IconButton
              color={task.status === 'completed' ? 'success' : 'default'}
              onClick={() => onToggleStatus?.(task.id, task.status === 'completed' ? 'pending' : 'completed')}
              sx={{ mt: 0.5 }}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography
                variant="h6"
                fontWeight={600}
                fontSize={profileTheme.textSize.large}
                sx={{
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                }}
              >
                {task.title}
              </Typography>
              {isOverdue && (
                <Tooltip title="Tarefa atrasada">
                  <WarningIcon color="error" fontSize="small" />
                </Tooltip>
              )}
              {isReprogrammed && (
                <Tooltip title="Tarefa reprogramada">
                  <RefreshIcon color="info" fontSize="small" />
                </Tooltip>
              )}
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
              <Chip
                label={getStatusText(task.status)}
                color={getStatusColor(task.status) as any}
                size="small"
              />
              <Chip
                label={getPriorityText(task.priority)}
                color={getPriorityColor(task.priority) as any}
                size="small"
                variant="outlined"
              />
              {(task.tags || []).map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            <Tooltip title="Editar tarefa">
              <IconButton color="primary" onClick={() => onEdit?.(task)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Adicionar/Ver foto">
              <IconButton color="info" onClick={() => onPhotoUpload?.(task.id)}>
                <PhotoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir tarefa">
              <IconButton color="error" onClick={() => onDelete?.(task.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={expanded ? 'Recolher detalhes' : 'Ver detalhes'}>
              <IconButton onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Responsável */}
        <Box display="flex" alignItems="center" gap={2} mb={2} p={2} bgcolor="grey.50" borderRadius={2}>
          <PersonIcon color="primary" />
          <Avatar sx={{ width: 32, height: 32, bgcolor: profileTheme.primaryColor }}>
            {responsible?.name?.[0] || '?'}
          </Avatar>
          <Box>
            <Typography fontWeight={600} fontSize={profileTheme.textSize.medium}>
              {responsible?.name || 'Responsável não definido'}
            </Typography>
            <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
              {responsible?.role || 'Perfil não definido'}
            </Typography>
          </Box>
        </Box>

        {/* Datas */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon fontSize="small" color="primary" />
              <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                Cadastrada: {task.createdAt.toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon fontSize="small" color="primary" />
              <Typography 
                fontSize={profileTheme.textSize.small} 
                color={isOverdue ? 'error' : 'text.secondary'}
                fontWeight={isOverdue ? 600 : 400}
              >
                Vencimento: {task.dueDate?.toLocaleDateString() || 'Não definido'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Detalhes expandidos */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          {/* Descrição */}
          {task.description && (
            <Box mb={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DescriptionIcon fontSize="small" color="primary" />
                <Typography fontWeight={600} fontSize={profileTheme.textSize.medium}>
                  Descrição
                </Typography>
              </Box>
              <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                {task.description}
              </Typography>
            </Box>
          )}

          {/* Observação */}
          {task.notes && (
            <Box mb={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <NoteIcon fontSize="small" color="primary" />
                <Typography fontWeight={600} fontSize={profileTheme.textSize.medium}>
                  Observação
                </Typography>
              </Box>
              <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                {task.notes}
              </Typography>
            </Box>
          )}

          {/* Foto */}
          {task.photo && (
            <Box mb={2}>
              <Typography fontWeight={600} fontSize={profileTheme.textSize.medium} mb={1}>
                Foto de Comprovação
              </Typography>
              <Box
                component="img"
                src={task.photo}
                alt="Foto da tarefa"
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid grey.300'
                }}
              />
            </Box>
          )}

          {/* Informações adicionais */}
          <Grid container spacing={2}>
            {task.location && (
              <Grid item xs={12} sm={6}>
                <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                  <strong>Local:</strong> {task.location}
                </Typography>
              </Grid>
            )}
            {task.estimatedTime && (
              <Grid item xs={12} sm={6}>
                <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                  <strong>Tempo estimado:</strong> {task.estimatedTime} min
                </Typography>
              </Grid>
            )}
            {task.actualTime && (
              <Grid item xs={12} sm={6}>
                <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                  <strong>Tempo real:</strong> {task.actualTime} min
                </Typography>
              </Grid>
            )}
            {task.completedAt && (
              <Grid item xs={12} sm={6}>
                <Typography fontSize={profileTheme.textSize.small} color="text.secondary">
                  <strong>Concluída em:</strong> {task.completedAt.toLocaleDateString()}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default TaskCard 
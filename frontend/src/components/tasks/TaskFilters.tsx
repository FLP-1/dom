/**
 * @fileoverview Filtros Avançados para Tarefas
 * @directory src/components/tasks
 * @description Componente de filtros com responsável, data, prioridade e status
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Button
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'
import { TaskFilter, TaskStatus, TaskPriority } from '@/types/tasks'
import { getProfileTheme } from '@/theme/profile-themes'

interface TaskFiltersProps {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  responsaveis: Array<{ id: string; name: string; nickname: string }>
  profile: string
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  onFilterChange,
  responsaveis,
  profile
}) => {
  const [expanded, setExpanded] = useState(false)
  const profileTheme = getProfileTheme(profile)

  const handleFilterChange = (key: keyof TaskFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return 'default'
      case 'in_progress': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      case 'paused': return 'info'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'error'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 3,
        background: profileTheme.cardStyle.background,
        border: profileTheme.cardStyle.border
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon color="primary" />
          <Typography variant="h6" fontWeight={600} color={profileTheme.primaryColor}>
            Filtros
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            size="small"
            onClick={clearFilters}
            startIcon={<ClearIcon />}
            variant="outlined"
            color="secondary"
          >
            Limpar
          </Button>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            color="primary"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Filtros básicos sempre visíveis */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Responsável</InputLabel>
            <Select
              value={filter.responsibleId?.[0] || ''}
              onChange={(e) => handleFilterChange('responsibleId', e.target.value ? [e.target.value] : undefined)}
              label="Responsável"
            >
              <MenuItem value="">Todos</MenuItem>
              {responsaveis.map(r => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name} ({r.nickname})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status?.[0] || ''}
              onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value] : undefined)}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pending">A Fazer</MenuItem>
              <MenuItem value="in_progress">Iniciada</MenuItem>
              <MenuItem value="completed">Terminada</MenuItem>
              <MenuItem value="cancelled">Descartada</MenuItem>
              <MenuItem value="paused">Reprogramada</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Prioridade</InputLabel>
            <Select
              value={filter.priority?.[0] || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value ? [e.target.value] : undefined)}
              label="Prioridade"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="urgent">Urgente</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
              <MenuItem value="medium">Normal</MenuItem>
              <MenuItem value="low">Baixa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Filtros avançados */}
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Data de Vencimento - De"
              type="date"
              value={filter.dueDate?.from?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleFilterChange('dueDate', {
                ...filter.dueDate,
                from: e.target.value ? new Date(e.target.value) : undefined
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Data de Vencimento - Até"
              type="date"
              value={filter.dueDate?.to?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleFilterChange('dueDate', {
                ...filter.dueDate,
                to: e.target.value ? new Date(e.target.value) : undefined
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Buscar por título, descrição ou observação"
              value={filter.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Digite para buscar..."
            />
          </Grid>
        </Grid>
      </Collapse>

      {/* Chips dos filtros ativos */}
      {(filter.responsibleId?.length || filter.status?.length || filter.priority?.length || filter.search) && (
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {filter.responsibleId?.map(id => {
            const responsavel = responsaveis.find(r => r.id === id)
            return (
              <Chip
                key={`resp-${id}`}
                label={`Responsável: ${responsavel?.name}`}
                onDelete={() => handleFilterChange('responsibleId', filter.responsibleId?.filter(r => r !== id))}
                color="primary"
                size="small"
              />
            )
          })}
          {filter.status?.map(status => (
            <Chip
              key={`status-${status}`}
              label={`Status: ${status === 'pending' ? 'A Fazer' : status === 'in_progress' ? 'Iniciada' : status === 'completed' ? 'Terminada' : status === 'cancelled' ? 'Descartada' : 'Reprogramada'}`}
              onDelete={() => handleFilterChange('status', filter.status?.filter(s => s !== status))}
              color={getStatusColor(status) as any}
              size="small"
            />
          ))}
          {filter.priority?.map(priority => (
            <Chip
              key={`priority-${priority}`}
              label={`Prioridade: ${priority === 'urgent' ? 'Urgente' : priority === 'high' ? 'Alta' : priority === 'medium' ? 'Normal' : 'Baixa'}`}
              onDelete={() => handleFilterChange('priority', filter.priority?.filter(p => p !== priority))}
              color={getPriorityColor(priority) as any}
              size="small"
            />
          ))}
          {filter.search && (
            <Chip
              label={`Busca: "${filter.search}"`}
              onDelete={() => handleFilterChange('search', '')}
              color="secondary"
              size="small"
            />
          )}
        </Box>
      )}
    </Paper>
  )
}

export default TaskFilters 
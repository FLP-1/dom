/**
 * @fileoverview Cards de Resumo de Status das Tarefas
 * @directory src/components/tasks
 * @description Cards visuais com resumo de tarefas por status
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip
} from '@mui/material'
import {
  Assignment as AssignmentIcon,
  PlayArrow as InProgressIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Pause as PausedIcon,
  Warning as OverdueIcon
} from '@mui/icons-material'
import { getProfileTheme } from '@/theme/profile-themes'

const TaskStatsCards = ({
  stats,
  profile,
  onCardClick
}) => {
  const profileTheme = getProfileTheme(profile)

  const statCards = [
    {
      title: 'Total',
      value: stats.total,
      icon: AssignmentIcon,
      color: profileTheme.primaryColor,
      bgColor: profileTheme.primaryColor + '15'
    },
    {
      title: 'A Fazer',
      value: stats.pending,
      icon: AssignmentIcon,
      color: '#757575',
      bgColor: '#75757515'
    },
    {
      title: 'Iniciadas',
      value: stats.inProgress,
      icon: InProgressIcon,
      color: '#FF9800',
      bgColor: '#FF980015'
    },
    {
      title: 'Terminadas',
      value: stats.completed,
      icon: CompletedIcon,
      color: '#4CAF50',
      bgColor: '#4CAF5015'
    },
    {
      title: 'Descartadas',
      value: stats.cancelled,
      icon: CancelledIcon,
      color: '#F44336',
      bgColor: '#F4433615'
    },
    {
      title: 'Reprogramadas',
      value: stats.pending - stats.inProgress - stats.completed - stats.cancelled,
      icon: PausedIcon,
      color: '#2196F3',
      bgColor: '#2196F315'
    },
    {
      title: 'Atrasadas',
      value: stats.overdue,
      icon: OverdueIcon,
      color: '#FF5722',
      bgColor: '#FF572215'
    }
  ]

  return (
    <Grid container spacing={2} mb={3}>
      {statCards.map((card, index) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
          <Card
            sx={{
              cursor: onCardClick ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              background: card.bgColor,
              border: `1px solid ${card.color}30`,
              '&:hover': onCardClick ? {
                transform: 'translateY(-4px)',
                boxShadow: 4,
                background: card.bgColor.replace('15', '25')
              } : {},
            }}
            onClick={() => onCardClick?.(card.title.toLowerCase())}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: card.color,
                  mx: 'auto',
                  mb: 1
                }}
              >
                <card.icon />
              </Avatar>
              <Typography
                variant="h4"
                fontWeight={700}
                color={card.color}
                fontSize={profileTheme.textSize.xlarge}
                mb={0.5}
              >
                {card.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={profileTheme.textSize.small}
                fontWeight={500}
              >
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default TaskStatsCards 
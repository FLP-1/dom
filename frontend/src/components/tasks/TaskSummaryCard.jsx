/**
 * @fileoverview Card de Resumo Único de Tarefas (Visual Harmônico)
 * @directory src/components/tasks
 * @description Card único elegante, inspirado no dashboard, com ícone, número, drilldowns discretos e visual padronizado
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Stack,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { getProfileTheme } from '@/theme/profile-themes'
import { useTranslation } from '@/utils/i18n'

const PERIODS = [
  { label: 'Hoje', value: 'today' },
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
  { label: 'Intervalo', value: 'custom' }
]

const STATUS = [
  { label: 'A Fazer', value: 'pending' },
  { label: 'Iniciada', value: 'in_progress' },
  { label: 'Terminada', value: 'completed' },
  { label: 'Descartada', value: 'cancelled' },
  { label: 'Reprogramada', value: 'paused' }
]

const TaskSummaryCard = ({
  count,
  period,
  onPeriodChange,
  status,
  onStatusChange,
  profile
}) => {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const profileTheme = getProfileTheme(profile)
  const [anchorPeriod, setAnchorPeriod] = React.useState(null)
  const [anchorStatus, setAnchorStatus] = React.useState(null)

  const handleOpenPeriod = (event) => {
    setAnchorPeriod(event.currentTarget)
  }
  const handleClosePeriod = () => {
    setAnchorPeriod(null)
  }
  const handleSelectPeriod = (value) => {
    onPeriodChange(value)
    handleClosePeriod()
  }

  const handleOpenStatus = (event) => {
    setAnchorStatus(event.currentTarget)
  }
  const handleCloseStatus = () => {
    setAnchorStatus(null)
  }
  const handleSelectStatus = (value) => {
    onStatusChange(value)
    handleCloseStatus()
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          border: `1.5px solid ${profileTheme.primaryColor}30`,
          minWidth: 320,
          maxWidth: 420,
          width: '100%',
          bgcolor: '#fff',
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          width: '100%'
        }}>
          <Avatar sx={{ bgcolor: profileTheme.primaryColor, width: 72, height: 72, mb: 2, boxShadow: 2 }}>
            <AssignmentIcon sx={{ fontSize: 40, color: '#fff' }} />
          </Avatar>
          <Typography variant="h2" fontWeight={700} color={profileTheme.primaryColor} sx={{ mb: 0.5, fontSize: '2.8rem' }}>
            {count}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500} sx={{ mb: 2, letterSpacing: 1 }}>
            {t('tasks.title', 'Tarefas')}
          </Typography>
          {/* Drilldowns em linha */}
          <Stack direction="row" spacing={2} width="100%" justifyContent="center">
            {/* Período */}
            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenPeriod}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: profileTheme.primaryColor,
                  color: profileTheme.primaryColor,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: 16,
                  px: 2,
                  minWidth: 100
                }}
              >
                {PERIODS.find(p => p.value === period)?.label || 'Período'}
              </Button>
              <Menu anchorEl={anchorPeriod} open={Boolean(anchorPeriod)} onClose={handleClosePeriod}>
                {PERIODS.map(p => (
                  <MenuItem key={p.value} selected={p.value === period} onClick={() => handleSelectPeriod(p.value)}>
                    {p.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* Status */}
            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenStatus}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: profileTheme.primaryColor,
                  color: profileTheme.primaryColor,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: 16,
                  px: 2,
                  minWidth: 120
                }}
              >
                {STATUS.find(s => s.value === status)?.label || 'Status'}
              </Button>
              <Menu anchorEl={anchorStatus} open={Boolean(anchorStatus)} onClose={handleCloseStatus}>
                {STATUS.map(s => (
                  <MenuItem key={s.value} selected={s.value === status} onClick={() => handleSelectStatus(s.value)}>
                    {s.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TaskSummaryCard 
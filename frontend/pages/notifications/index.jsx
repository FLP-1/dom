/**
 * @fileoverview Página de listagem de notificações
 * @directory pages/notifications
 * @description Página para visualizar e gerenciar notificações do sistema
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material'
import { 
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as MarkAllReadIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useActiveContext } from '@/context/ActiveContext'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationCard } from '@/components/notifications'
import { getProfileTheme } from '@/theme/profile-themes'
import { ProtectedRoute } from '@/components/auth'



export default function NotificationsPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { profile } = useActiveContext()
  const theme = getProfileTheme(profile)
  
  // Estados
  const [filter, setFilter] = useState('all') // all, unread, urgent, today
  const [showFilters, setShowFilters] = useState(false)
  
  // Hook de notificações
  const {
    notifications,
    loading,
    error,
    stats,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasUnread,
    hasUrgent,
    hasToday
  } = useNotifications(profile)
  
  // Filtra notificações baseado no filtro selecionado
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.lida
      case 'urgent':
        return notification.prioridade === 'urgente'
      case 'today':
        const today = new Date().toDateString()
        const notificationDate = new Date(notification.data_criacao).toDateString()
        return today === notificationDate
      default:
        return true
    }
  })
  
  // Atualiza notificações quando o filtro muda
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])
  
  // Handlers
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId)
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }
  
  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId)
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }
  
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }
  
  const handleRefresh = () => {
    fetchNotifications()
  }
  
  const handleNewNotification = () => {
    router.push('/notifications/new')
  }
  
  return (
    <ProtectedRoute allowedProfiles={['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <NotificationIcon 
            sx={{ 
              fontSize: '32px', 
              color: theme.primaryColor 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ color: theme.primaryColor }}
          >
            {t('notifications.title', 'Notificações')}
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          {/* Botão de filtros */}
          <Tooltip title={t('notifications.filters', 'Filtros')}>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{ color: theme.primaryColor }}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
          
          {/* Botão de atualizar */}
          <Tooltip title={t('notifications.refresh', 'Atualizar')}>
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{ color: theme.primaryColor }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          {/* Marcar todas como lidas */}
          {hasUnread && (
            <Tooltip title={t('notifications.mark_all_read', 'Marcar todas como lidas')}>
              <IconButton
                onClick={handleMarkAllAsRead}
                sx={{ color: theme.primaryColor }}
              >
                <MarkAllReadIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {/* Nova notificação */}
          <Tooltip title={t('notifications.add_new', 'Nova Notificação')}>
            <IconButton
              onClick={handleNewNotification}
              sx={{ 
                color: 'white',
                bgcolor: theme.primaryColor,
                '&:hover': {
                  bgcolor: theme.primaryDarkColor
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Filtros */}
      {showFilters && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label={t('notifications.filter.all', 'Todas')}
              color={filter === 'all' ? 'primary' : 'default'}
              onClick={() => setFilter('all')}
              clickable
            />
            <Chip
              label={t('notifications.filter.unread', 'Não lidas')}
              color={filter === 'unread' ? 'primary' : 'default'}
              onClick={() => setFilter('unread')}
              clickable
              icon={<NotificationIcon />}
            />
            <Chip
              label={t('notifications.filter.urgent', 'Urgentes')}
              color={filter === 'urgent' ? 'error' : 'default'}
              onClick={() => setFilter('urgent')}
              clickable
            />
            <Chip
              label={t('notifications.filter.today', 'Hoje')}
              color={filter === 'today' ? 'success' : 'default'}
              onClick={() => setFilter('today')}
              clickable
            />
          </Box>
        </Card>
      )}
      
      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.stats.total', 'Total')}
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main">
              {stats.unread}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.stats.unread', 'Não lidas')}
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main">
              {stats.today}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.stats.today', 'Hoje')}
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="error.main">
              {stats.urgent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.stats.urgent', 'Urgentes')}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      
      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Lista de notificações */}
      {!loading && !error && (
        <Grid container spacing={2}>
          {filteredNotifications.length === 0 ? (
            <Grid xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <NotificationIcon sx={{ fontSize: '64px', color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t('notifications.empty.title', 'Nenhuma notificação encontrada')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('notifications.empty.description', 'Você não tem notificações para exibir.')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            filteredNotifications.map((notification) => (
              <Grid xs={12} key={notification.id}>
                <NotificationCard
                  notification={notification}
                  profile={profile}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  showActions={true}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
    </ProtectedRoute>
  )
} 
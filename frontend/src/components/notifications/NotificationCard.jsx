/**
 * @fileoverview Componente de card de notificação
 * @directory src/components/notifications
 * @description Card reutilizável para exibir notificações com adaptação por perfil
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React, { memo } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material'
import { 
  Notifications as NotificationIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  PriorityHigh as UrgentIcon,
  Schedule as TimeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
import { getProfileTheme } from '@/theme/profile-themes'

/**
 * Componente de card de notificação
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.notification - Dados da notificação
 * @param {string} props.profile - Perfil do usuário
 * @param {Function} props.onMarkAsRead - Função para marcar como lida
 * @param {Function} props.onDelete - Função para deletar
 * @param {Function} props.onEdit - Função para editar
 * @param {boolean} props.showActions - Se deve mostrar ações
 * @returns {JSX.Element} Card de notificação
 */
const NotificationCard = memo(({ 
  notification, 
  profile = 'empregador',
  onMarkAsRead,
  onDelete,
  onEdit,
  showActions = true
}) => {
  const { t } = useTranslation('common')
  const theme = getProfileTheme(profile)
  
  // Formata data
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return t('notifications.just_now', 'Agora mesmo')
    } else if (diffInHours < 24) {
      return t('notifications.hours_ago', '{{hours}}h atrás', { hours: diffInHours })
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }
  
  // Obtém ícone baseado no tipo
  const getTypeIcon = (type) => {
    const iconMap = {
      'task_created': '📋',
      'task_completed': '✅',
      'task_overdue': '⚠️',
      'payment_due': '💰',
      'payment_received': '💳',
      'system_alert': '🔔',
      'family_share': '👨‍👩‍👧‍👦'
    }
    return iconMap[type] || '📢'
  }
  
  // Obtém cor baseada na prioridade
  const getPriorityColor = (priority) => {
    const colorMap = {
      'baixa': 'success',
      'normal': 'primary',
      'alta': 'warning',
      'urgente': 'error'
    }
    return colorMap[priority] || 'primary'
  }
  
  // Obtém estilo do card baseado no perfil
  const getCardStyle = () => {
    const baseStyle = {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.cardHoverShadow
      }
    }
    
    // Estilo específico por perfil
    const profileStyles = {
      empregado: {
        ...baseStyle,
        fontSize: '16px',
        padding: '16px'
      },
      admin: {
        ...baseStyle,
        fontSize: '12px',
        padding: '8px'
      },
      owner: {
        ...baseStyle,
        border: '2px solid #FFD700',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        color: '#FFFFFF'
      }
    }
    
    return profileStyles[profile] || baseStyle
  }
  
  return (
    <Card 
      sx={getCardStyle()}
      onClick={() => !notification.lida && onMarkAsRead?.(notification.id)}
    >
      <CardContent sx={{ p: profile === 'empregado' ? 3 : 2 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          {/* Ícone da notificação */}
          <Avatar 
            sx={{ 
              bgcolor: notification.lida ? 'grey.300' : theme.primaryColor,
              width: profile === 'empregado' ? 48 : 40,
              height: profile === 'empregado' ? 48 : 40,
              fontSize: profile === 'empregado' ? '24px' : '20px'
            }}
          >
            {getTypeIcon(notification.tipo)}
          </Avatar>
          
          {/* Conteúdo principal */}
          <Box flex={1} minWidth={0}>
            {/* Cabeçalho */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography 
                variant={profile === 'empregado' ? 'h6' : 'subtitle1'}
                component="h3"
                sx={{ 
                  fontWeight: notification.lida ? 'normal' : 'bold',
                  color: notification.lida ? 'text.secondary' : 'text.primary',
                  flex: 1
                }}
              >
                {notification.titulo}
              </Typography>
              
              {/* Indicador de não lida */}
              {!notification.lida && (
                <Tooltip title={t('notifications.unread', 'Não lida')}>
                  <UnreadIcon 
                    sx={{ 
                      color: theme.primaryColor,
                      fontSize: profile === 'empregado' ? '24px' : '20px'
                    }} 
                  />
                </Tooltip>
              )}
              
              {/* Indicador de urgente */}
              {notification.prioridade === 'urgente' && (
                <Tooltip title={t('notifications.urgent', 'Urgente')}>
                  <UrgentIcon 
                    sx={{ 
                      color: 'error.main',
                      fontSize: profile === 'empregado' ? '24px' : '20px'
                    }} 
                  />
                </Tooltip>
              )}
            </Box>
            
            {/* Mensagem */}
            <Typography 
              variant={profile === 'empregado' ? 'body1' : 'body2'}
              sx={{ 
                color: 'text.secondary',
                mb: 2,
                lineHeight: 1.5
              }}
            >
              {notification.mensagem}
            </Typography>
            
            {/* Chips de informação */}
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {/* Prioridade */}
              <Chip
                label={t(`notifications.priority.${notification.prioridade}`, notification.prioridade)}
                color={getPriorityColor(notification.prioridade)}
                size={profile === 'empregado' ? 'medium' : 'small'}
                variant="outlined"
              />
              
              {/* Categoria */}
              {notification.categoria && (
                <Chip
                  label={t(`notifications.category.${notification.categoria}`, notification.categoria)}
                  size={profile === 'empregado' ? 'medium' : 'small'}
                  variant="outlined"
                />
              )}
              
              {/* Data */}
              <Box display="flex" alignItems="center" gap={0.5}>
                <TimeIcon sx={{ fontSize: profile === 'empregado' ? '20px' : '16px' }} />
                <Typography 
                  variant={profile === 'empregado' ? 'body2' : 'caption'}
                  color="text.secondary"
                >
                  {formatDate(notification.data_criacao)}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Ações */}
          {showActions && (
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Marcar como lida */}
              {!notification.lida && onMarkAsRead && (
                <Tooltip title={t('notifications.mark_as_read', 'Marcar como lida')}>
                  <IconButton
                    size={profile === 'empregado' ? 'large' : 'medium'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkAsRead(notification.id)
                    }}
                    sx={{ color: theme.primaryColor }}
                  >
                    <ReadIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {/* Editar */}
              {onEdit && (
                <Tooltip title={t('notifications.edit', 'Editar')}>
                  <IconButton
                    size={profile === 'empregado' ? 'large' : 'medium'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(notification)
                    }}
                    sx={{ color: 'info.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {/* Deletar */}
              {onDelete && (
                <Tooltip title={t('notifications.delete', 'Deletar')}>
                  <IconButton
                    size={profile === 'empregado' ? 'large' : 'medium'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(notification.id)
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
})

NotificationCard.displayName = 'NotificationCard'

export default NotificationCard 
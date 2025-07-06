/**
 * @fileoverview Card de grupo
 * @directory frontend/src/components/groups
 * @description Componente para exibir informações de um grupo com ações rápidas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React, { memo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
import { Group } from '@/hooks/useGroups'
import { useUser } from '@/context/UserContext'

const GroupCard = memo(({
  group,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}) => {
  const { t } = useTranslation()
  const { user } = useUser()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAction = (action) => {
    action()
    handleMenuClose()
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'family': return 'primary'
      case 'work': return 'secondary'
      case 'community': return 'success'
      case 'other': return 'default'
      default: return 'default'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'family': return '👨‍👩‍👧‍👦'
      case 'work': return '💼'
      case 'community': return '🏘️'
      case 'other': return '📋'
      default: return '📋'
    }
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Header com nome e menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {group.name}
            </Typography>
          </Box>
          
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            aria-label={t('common.actions')}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Menu de ações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleAction(() => onView(group))}>
            <VisibilityIcon sx={{ mr: 1 }} />
            {t('common.view')}
          </MenuItem>
          <MenuItem onClick={() => handleAction(() => onEdit(group))}>
            <EditIcon sx={{ mr: 1 }} />
            {t('common.edit')}
          </MenuItem>
          <MenuItem onClick={() => handleAction(() => onToggleStatus(group.id))}>
            {group.status === 'active' ? (
              <>
                <BlockIcon sx={{ mr: 1 }} />
                {t('common.deactivate')}
              </>
            ) : (
              <>
                <CheckCircleIcon sx={{ mr: 1 }} />
                {t('common.activate')}
              </>
            )}
          </MenuItem>
          <MenuItem 
            onClick={() => handleAction(() => onDelete(group.id))}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            {t('common.delete')}
          </MenuItem>
        </Menu>

        {/* Descrição */}
        {group.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2, lineHeight: 1.4 }}
          >
            {group.description}
          </Typography>
        )}

        {/* Chips de tipo e status */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<span>{getTypeIcon(group.type)}</span>}
            label={t(`groups.types.${group.type}`)}
            color={getTypeColor(group.type)}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={group.status === 'active' ? <CheckCircleIcon /> : <BlockIcon />}
            label={t(`groups.status.${group.status}`)}
            color={getStatusColor(group.status)}
            size="small"
          />
        </Box>

        {/* Estatísticas de membros */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {group.member_count} {t('groups.members')}
            </Typography>
          </Box>
          
          {group.admin_count > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AdminIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2" color="primary.main">
                {group.admin_count} {t('groups.admins')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Data de criação */}
        <Typography variant="caption" color="text.secondary">
          {t('common.created')}: {formatDate(group.created_at)}
        </Typography>
      </CardContent>
    </Card>
  )
})

GroupCard.displayName = 'GroupCard'

export default GroupCard 
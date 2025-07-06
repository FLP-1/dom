/**
 * @fileoverview Cards de estatísticas de grupos
 * @directory frontend/src/components/groups
 * @description Componente para exibir estatísticas de grupos em cards visuais
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React, { memo } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material'
import {
  Groups as GroupsIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  FamilyRestroom as FamilyIcon,
  Work as WorkIcon,
  Home as CommunityIcon,
  Category as OtherIcon,
} from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
import { GroupStats } from '@/hooks/useGroups'

const GroupStatsCards = memo(({ stats, loading = false }) => {
  const { t } = useTranslation()

  if (!stats && !loading) {
    return null
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'family': return <FamilyIcon />
      case 'work': return <WorkIcon />
      case 'community': return <CommunityIcon />
      case 'other': return <OtherIcon />
      default: return <OtherIcon />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'family': return '#1976d2'
      case 'work': return '#9c27b0'
      case 'community': return '#2e7d32'
      case 'other': return '#757575'
      default: return '#757575'
    }
  }

  const calculatePercentage = (value, total) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary.main',
    subtitle,
    progress,
  }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              {loading ? '...' : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        {progress !== undefined && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {progress.toFixed(1)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )

  const TypeCard = ({ type, count, total }) => {
    const percentage = calculatePercentage(count, total)
    const color = getTypeColor(type)
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ color, mr: 1 }}>
              {getTypeIcon(type)}
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {loading ? '...' : count}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t(`groups.types.${type}`)}
          </Typography>
          
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 3,
              borderRadius: 1.5,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
          />
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {percentage.toFixed(1)}% {t('common.of')} {total}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        {t('groups.stats.title')}
      </Typography>
      
      {/* Cards principais */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('groups.stats.totalGroups')}
            value={stats?.total_groups || 0}
            icon={<GroupsIcon sx={{ color: 'white' }} />}
            color="#1976d2"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('groups.stats.activeGroups')}
            value={stats?.active_groups || 0}
            icon={<TrendingUpIcon sx={{ color: 'white' }} />}
            color="#2e7d32"
            progress={stats ? calculatePercentage(stats.active_groups, stats.total_groups) : 0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('groups.stats.totalMembers')}
            value={stats?.total_members || 0}
            icon={<GroupIcon sx={{ color: 'white' }} />}
            color="#9c27b0"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('groups.stats.inactiveGroups')}
            value={stats?.inactive_groups || 0}
            icon={<TrendingDownIcon sx={{ color: 'white' }} />}
            color="#d32f2f"
            progress={stats ? calculatePercentage(stats.inactive_groups, stats.total_groups) : 0}
          />
        </Grid>
      </Grid>

      {/* Cards por tipo */}
      {stats && (
        <Box>
          <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
            {t('groups.stats.byType')}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TypeCard
                type="family"
                count={stats.groups_by_type.family}
                total={stats.total_groups}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TypeCard
                type="work"
                count={stats.groups_by_type.work}
                total={stats.total_groups}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TypeCard
                type="community"
                count={stats.groups_by_type.community}
                total={stats.total_groups}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TypeCard
                type="other"
                count={stats.groups_by_type.other}
                total={stats.total_groups}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
})

GroupStatsCards.displayName = 'GroupStatsCards'

export default GroupStatsCards 
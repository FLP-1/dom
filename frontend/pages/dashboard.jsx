"use client";

/**
 * @fileoverview Dashboard principal do aplicativo DOM
 * @directory pages
 * @description Dashboard adaptativo com menu lateral para diferentes perfis de usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@/utils/i18n'
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { 
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Wifi as WifiIcon,
  LocationOn as LocationIcon,
  Add as AddIcon
} from '@mui/icons-material'
import Image from 'next/image'
import { 
  getProfileColor, 
  getProfileFontSize, 
  getProfileSpacing, 
  getProfileIconSize, 
  getProfileAvatarSize,
  getProfileCardStyle 
} from '@/theme/profile-themes'
import MainLayout from '@/components/MainLayout'
import { useUser } from '@/context/UserContext'

function MenuItem(props) {
  const { id, label, icon, path, profiles } = props;
  const { selectedMenu, setSelectedMenu } = props;
  const { handleMenuClick } = props;

  return (
    <ListItem key={id} disablePadding>
      <ListItemButton
        selected={selectedMenu === id}
        onClick={() => handleMenuClick(id)}
        sx={{
          '&.Mui-selected': {
            backgroundColor: `${props.getProfileColor(props.profile)}20`,
            '&:hover': {
              backgroundColor: `${props.getProfileColor(props.profile)}30`,
            },
          },
          fontSize: props.getProfileFontSize(props.profile),
          padding: props.getProfileSpacing(props.profile),
        }}
      >
        <ListItemIcon sx={{ 
          color: selectedMenu === id ? props.getProfileColor(props.profile) : 'inherit',
          fontSize: props.getProfileIconSize(props.profile)
        }}>
          {icon}
        </ListItemIcon>
        <ListItemText 
          primary={label}
          sx={{ 
            '& .MuiTypography-root': {
              fontWeight: selectedMenu === id ? 'bold' : 'normal',
              fontSize: props.getProfileFontSize(props.profile)
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

function User(props) {
  const { name, nickname, cpf, profile, user_photo, email, celular } = props;
  const { t } = useTranslation('common');

  // Função para formatar CPF
  const formatCPF = (cpf) => {
    if (typeof cpf !== 'string') return ''
    const numbers = cpf.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Função para formatar celular
  const formatCelular = (celular) => {
    if (typeof celular !== 'string') return ''
    const numbers = celular.replace(/\D/g, '')
    if (numbers.length === 11) {
      return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7)}`
    }
    return celular
  }

  // Usar nickname se disponível, senão usar primeira palavra do nome
  const displayName = nickname || (typeof name === 'string' && name ? name.split(' ')[0] : 'Usuário')
  
  // Usar mensagem específica do perfil ativo ou fallback para mensagem comum
  const welcomeLabel = t(`${profile}.dashboard.welcome`, t('common.dashboard.welcome', 'Bem-vindo'))

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{
        ...getProfileCardStyle(profile),
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          {/* Foto à esquerda */}
          <Box display="flex" alignItems="center" justifyContent="center" minWidth={96} minHeight={96}>
            {user_photo ? (
              <Avatar
                src={`data:image/jpeg;base64,${user_photo}`}
                alt={displayName}
                sx={{ width: 96, height: 96, border: `2px solid ${getProfileColor(profile)}`, bgcolor: '#fff' }}
              />
            ) : (
              <Avatar
                sx={{ bgcolor: getProfileColor(profile), width: 96, height: 96, fontSize: 40 }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>
          {/* Dados à direita */}
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center" gap={1}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: getProfileFontSize(profile, 'large') }}
            >
              {welcomeLabel} {displayName}
            </Typography>
            <Chip
              label={typeof profile === 'string' && profile ? profile.charAt(0).toUpperCase() + profile.slice(1) : 'Perfil'}
              size="small"
              sx={{
                bgcolor: getProfileColor(profile),
                color: 'white',
                fontSize: getProfileFontSize(profile, 'small')
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: getProfileFontSize(profile, 'small') }}
            >
              CPF: {formatCPF(cpf)}
            </Typography>
            {email && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: getProfileFontSize(profile, 'small') }}
              >
                Email: {email}
              </Typography>
            )}
            {celular && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: getProfileFontSize(profile, 'small') }}
              >
                Celular: {formatCelular(celular)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

function TaskStatsCard(props) {
  const { task_stats, profile } = props;
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleAddTask = () => {
    router.push('/tasks/new')
  }

  const handleProgressClick = () => {
    router.push('/tasks')
  }

  // Mensagens centralizadas por perfil ou fallback
  const totalLabel = t(`${profile}.dashboard.total`, t('common.dashboard.total', 'Total'))
  const completedLabel = t(`${profile}.dashboard.completed`, t('common.dashboard.completed', 'Concluídas'))
  const progressLabel = t(`${profile}.dashboard.progress`, t('common.dashboard.progress', 'Progresso'))
  const addTaskLabel = t(`${profile}.dashboard.add_task`, t('common.dashboard.add_task', 'Nova Tarefa'))
  const tasksLabel = t(`${profile}.dashboard.tasks`, t('common.dashboard.tasks', 'Tarefas'))

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{
        ...getProfileCardStyle(profile),
        height: '100%', // Garantir que todos os cards tenham a mesma altura
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AssignmentIcon sx={{ color: props.getProfileColor(profile) }} />
              <Typography 
                variant="h6" 
                sx={{ fontSize: props.getProfileFontSize(profile, 'medium') }}
              >
                {tasksLabel}
              </Typography>
            </Box>
            <Tooltip title={addTaskLabel} arrow>
              <span>
                <IconButton
                  size="small"
                  onClick={handleAddTask}
                  sx={{ 
                    color: props.getProfileColor(profile),
                    '&:hover': {
                      bgcolor: `${props.getProfileColor(profile)}10`
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography 
                  variant="h4" 
                  color="primary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'xlarge') }}
                >
                  {task_stats?.total_tarefas || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {totalLabel}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#4caf50',
                    fontSize: props.getProfileFontSize(profile, 'xlarge')
                  }}
                >
                  {task_stats?.tarefas_concluidas || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {completedLabel}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {task_stats?.total_tarefas && task_stats.total_tarefas > 0 && (
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {progressLabel}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {Math.round(((task_stats.tarefas_concluidas || 0) / task_stats.total_tarefas) * 100)}%
                </Typography>
              </Box>
              <Box 
                onClick={handleProgressClick}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <LinearProgress 
                  variant="determinate" 
                  value={((task_stats.tarefas_concluidas || 0) / task_stats.total_tarefas) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: props.getProfileColor(profile)
                    }
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

function NotificationStatsCard(props) {
  const { notification_stats, profile } = props;
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleAddNotification = () => {
    router.push('/notifications/new')
  }

  const handleUrgentClick = () => {
    router.push('/notifications?filter=urgent')
  }

  // Mensagens centralizadas por perfil ou fallback
  const totalLabel = t(`${profile}.dashboard.total`, t('common.dashboard.total', 'Total'))
  const urgentLabel = t(`${profile}.dashboard.urgent`, t('common.dashboard.urgent', 'Urgentes'))
  const viewUrgentLabel = t(`${profile}.dashboard.view_urgent`, t('common.dashboard.view_urgent', 'Ver Urgentes'))
  const addNotificationLabel = t(`${profile}.dashboard.add_notification`, t('common.dashboard.add_notification', 'Nova Notificação'))
  const notificationsLabel = t(`${profile}.dashboard.notifications`, t('common.dashboard.notifications', 'Notificações'))

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{
        ...getProfileCardStyle(profile),
        height: '100%', // Garantir que todos os cards tenham a mesma altura
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsIcon sx={{ color: props.getProfileColor(profile) }} />
              <Typography 
                variant="h6" 
                sx={{ fontSize: props.getProfileFontSize(profile, 'medium') }}
              >
                {notificationsLabel}
              </Typography>
            </Box>
            <Tooltip title={addNotificationLabel} arrow>
              <span>
                <IconButton
                  size="small"
                  onClick={handleAddNotification}
                  sx={{ 
                    color: props.getProfileColor(profile),
                    '&:hover': {
                      bgcolor: `${props.getProfileColor(profile)}10`
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography 
                  variant="h4" 
                  color="primary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'xlarge') }}
                >
                  {notification_stats?.total_notificacoes || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {totalLabel}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#ff9800',
                    fontSize: props.getProfileFontSize(profile, 'xlarge')
                  }}
                >
                  {notification_stats?.notificacoes_urgentes || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {urgentLabel}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {notification_stats?.notificacoes_urgentes && notification_stats.notificacoes_urgentes > 0 && (
            <Box mt={2}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleUrgentClick}
                sx={{ 
                  color: '#ff9800',
                  borderColor: '#ff9800',
                  '&:hover': {
                    borderColor: '#f57c00',
                    bgcolor: '#ff980010'
                  }
                }}
                fullWidth
              >
                {viewUrgentLabel}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

function HeaderInfo({ profile, getProfileFontSize }) {
  const { t } = useTranslation('common');
  const [currentTime, setCurrentTime] = useState(new Date())
  const [connectionType, setConnectionType] = useState('')
  const [location, setLocation] = useState(t('dashboard.location_loading', 'Carregando...'))
  const [isClient, setIsClient] = useState(false)
  const [geoError, setGeoError] = useState(null)

  useEffect(() => {
    // Atualizar hora a cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Detectar tipo de conexão
    if (navigator.connection) {
      const type = navigator.connection.type || navigator.connection.effectiveType
      console.log('[Dashboard] Tipo de conexão detectado:', type)
      if (type === 'wifi') setConnectionType('Wi-Fi')
      else if (type === 'cellular') setConnectionType('Rede móvel')
      else setConnectionType(type || 'Online')
    } else {
      setConnectionType(navigator.onLine ? 'Online' : 'Offline')
    }

    // Obter geolocalização e buscar endereço
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          console.log('[Dashboard] Geolocalização obtida:', latitude, longitude)
          try {
            const response = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
            const data = await response.json()
            if (data && data.display_name) {
              setLocation(data.display_name)
              setGeoError(null)
              console.log('[Dashboard] Endereço obtido:', data.display_name)
            } else {
              setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
              setGeoError('Sem endereço detalhado')
            }
          } catch (e) {
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
            setGeoError('Erro ao buscar endereço')
            console.error('[Dashboard] Erro ao buscar endereço:', e)
          }
        },
        (error) => {
          setLocation(t('dashboard.location_unavailable', 'Não disponível'))
          setGeoError(error.message)
          console.error('[Dashboard] Erro de geolocalização:', error)
        }
      )
    } else {
      setLocation(t('dashboard.location_unsupported', 'Não suportado'))
      setGeoError('API de geolocalização não suportada')
    }

    setIsClient(true)

    return () => {
      clearInterval(timeInterval)
    }
  }, [t])

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      gap={2}
      sx={{ 
        fontSize: getProfileFontSize(profile, 'small'),
        color: '#000000',
        flexWrap: 'wrap',
        minHeight: 32,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        px: 2,
        py: 1,
        borderRadius: 2,
        backdropFilter: 'blur(10px)'
      }}
    >
      {isClient && (
        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleIcon sx={{ fontSize: 16 }} aria-label="Horário atual" />
          <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small'), color: '#000000', fontWeight: 600 }}>
            {formatTime(currentTime)}
          </Typography>
        </Box>
      )}
      <Box display="flex" alignItems="center" gap={1}>
        <WifiIcon sx={{ fontSize: 16, color: connectionType === 'Offline' ? '#f44336' : '#4caf50' }} aria-label="Status da conexão" />
        <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small'), color: connectionType === 'Offline' ? '#d32f2f' : '#000000', fontWeight: 600, minWidth: 60 }}>
          {connectionType || t('dashboard.connection_unknown', 'Desconhecido')}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <LocationIcon sx={{ fontSize: 16 }} aria-label="Localização" />
        <Tooltip title={location}>
          <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small'), maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#000000', fontWeight: 600 }}>
            {location || t('dashboard.location_unavailable', 'Não disponível')}
          </Typography>
        </Tooltip>
        {geoError && (
          <Tooltip title={geoError}>
            <Typography variant="caption" color="#ffeb3b" sx={{ ml: 1 }}>
              ⚠️
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

function DashboardNewUserButton({ profile }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  // Perfis permitidos
  const canCreateUser = ['admin', 'owner', 'empregador'].includes(profile);
  if (!canCreateUser) return null;
  return (
    <Button
      variant="contained"
      startIcon={<PeopleIcon />}
      sx={{
        bgcolor: '#ffd600',
        color: '#222',
        fontWeight: 700,
        borderRadius: 8,
        px: 3,
        py: 1.2,
        boxShadow: 2,
        '&:hover': { bgcolor: '#ffea00' },
        mb: 3,
        ml: 1
      }}
      onClick={() => router.push('/people')}
    >
      {t('users.new', 'Novo Usuário')}
    </Button>
  );
}


const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    profiles: ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
  },
  {
    id: 'tasks',
    label: 'Tarefas',
    icon: <AssignmentIcon />,
    path: '/tasks',
    profiles: ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
  },
  {
    id: 'people',
    label: 'Pessoas',
    icon: <PeopleIcon />,
    path: '/people',
    profiles: ['empregador', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
  },
  {
    id: 'notifications',
    label: 'Notificações',
    icon: <NotificationsIcon />,
    path: '/notifications',
    profiles: ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: <SettingsIcon />,
    path: '/settings',
    profiles: ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
  }
]

const getProfileIcon = (profile) => {
  const icons = {
    empregador: <HomeIcon />,
    empregado: <WorkIcon />,
    familiar: <SchoolIcon />,
    parceiro: <BusinessIcon />,
    subordinado: <WorkIcon />,
    admin: <AdminIcon />,
    owner: <AdminIcon />
  }
  return icons[profile] || <HomeIcon />
}

// Funções de tema centralizadas importadas de profile-themes.ts

const drawerWidth = 240

export default function Dashboard() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation('common')
  const { user, loading } = useUser()
  const { activeContext } = useUser()
  const groupId = activeContext?.groupId
  const groupName = activeContext?.groupName
  const role = activeContext?.role
  const activeProfile = activeContext?.profile
  const refreshTrigger = activeContext?.refreshTrigger
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState(null)
  
  // DEBUG: Logs para identificar o problema
  console.log('🔍 Dashboard Debug:', {
    user,
    loading,
    groupId,
    groupName,
    role,
    activeProfile,
    refreshTrigger,
    localStorage: {
      userToken: typeof window !== 'undefined' ? localStorage.getItem('userToken') : null,
      userData: typeof window !== 'undefined' ? localStorage.getItem('userData') : null
    }
  })
  
  // Usar perfil do contexto ativo, senão do usuário, senão fallback
  const profile = activeContext?.profile || user?.profile || 'empregador'
  
  // Função para buscar estatísticas do dashboard
  const fetchStats = useCallback(async () => {
    console.log('🔍 Dashboard Debug: Iniciando busca de estatísticas...')
    setLoadingStats(true)
    setStatsError(null)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null
      console.log('🔍 Dashboard Debug: Token disponível:', !!token)
      
      const response = await fetch(`/api/dashboard/stats?profile=${profile}&user_id=${user?.id || 'user_123'}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('🔍 Dashboard Debug: Status da resposta:', response.status)
      
      if (!response.ok) {
        console.log('❌ Dashboard Debug: Erro na resposta:', response.status, response.statusText)
        throw new Error('Erro ao buscar estatísticas')
      }
      
      const data = await response.json()
      console.log('✅ Dashboard Debug: Dados recebidos:', data)
      setDashboardStats(data)
    } catch (err) {
      console.error('❌ Dashboard Debug: Erro ao buscar estatísticas:', err)
      setStatsError(t('dashboard.error_loading', 'Erro ao carregar estatísticas do dashboard'))
    } finally {
      setLoadingStats(false)
      console.log('🔍 Dashboard Debug: Busca de estatísticas finalizada')
    }
  }, [profile, user?.id, t])

  // Recarregar dados quando o usuário mudar
  useEffect(() => {
    if (user && user.profile) {
      console.log('Usuário carregado no dashboard:', { user: user.name, profile: user.profile })
      fetchStats()
    }
  }, [user, fetchStats])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile')
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('activeContext')
    }
    router.push('/login')
  }

  const filteredMenuItems = menuItems.filter(item => 
    item.profiles.includes(profile)
  )

  const drawer = (
    <Box>
      <Box sx={{ 
        backgroundColor: getProfileColor(profile),
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        height: 64,
        minHeight: 64,
        px: 2, // padding horizontal
        boxSizing: 'border-box',
      }}>
        <Image
          src="/Logo_CasaMaoCoracao.png"
          alt="DOM Logo"
          width={40}
          height={40}
          style={{ borderRadius: '8px' }}
        />
        <Box>
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
            DOM
          </Typography>
        </Box>
      </Box>
      <Divider />
      
      <List>
        {filteredMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            path={item.path}
            profiles={item.profiles}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            handleMenuClick={handleMenuClick}
            getProfileColor={getProfileColor}
            getProfileFontSize={getProfileFontSize}
            getProfileSpacing={getProfileSpacing}
            getProfileIconSize={getProfileIconSize}
            profile={profile}
          />
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#f44336' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('common.dashboard.logout', 'Sair do Sistema')}
              sx={{ 
                '& .MuiTypography-root': {
                  color: '#f44336',
                  fontSize: getProfileFontSize(profile, 'small')
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  // Carregar dados do usuário se não estiverem no localStorage
  useEffect(() => {
    const loadUserData = async () => {
      if (typeof window === 'undefined') return;
      
      const userData = localStorage.getItem('userData')
      if (!userData || !JSON.parse(userData).name) {
        try {
          const token = localStorage.getItem('userToken')
          if (token) {
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (response.ok) {
              const userInfo = await response.json()
              localStorage.setItem('userData', JSON.stringify(userInfo))
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error)
        }
      }
    }
    loadUserData()
  }, [])

  // Carregar estatísticas iniciais quando o usuário estiver disponível
  useEffect(() => {
    if (user && user.profile) {
      fetchStats()
    }
  }, [user, fetchStats])

  const renderDashboardContent = () => {
    console.log('🔍 Dashboard Debug: Renderizando conteúdo, selectedMenu:', selectedMenu)
    
    if (loadingStats) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      )
    }

    if (statsError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">{statsError}</Typography>
        </Box>
      )
    }

    switch (selectedMenu) {
      case 'dashboard':
        return (
          <Box>
            <HeaderInfo profile={profile} getProfileFontSize={getProfileFontSize} />
            {/* Botão Novo Usuário */}
            <DashboardNewUserButton profile={profile} />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Card do usuário */}
              <User
                name={user?.name}
                nickname={user?.nickname}
                cpf={user?.cpf}
                profile={profile}
                user_photo={user?.user_photo}
                email={user?.email}
                celular={user?.celular}
              />
              
              {/* Card de estatísticas de tarefas */}
              <TaskStatsCard
                task_stats={dashboardStats?.task_stats}
                profile={profile}
                getProfileColor={getProfileColor}
                getProfileFontSize={getProfileFontSize}
              />
              
              {/* Card de estatísticas de notificações */}
              <NotificationStatsCard
                notification_stats={dashboardStats?.notification_stats}
                profile={profile}
                getProfileColor={getProfileColor}
                getProfileFontSize={getProfileFontSize}
              />
            </Grid>
          </Box>
        )
      
      case 'people':
        router.push('/people')
        return null
      
      case 'tasks':
        router.push('/tasks')
        return null
      
      case 'groups':
        router.push('/groups')
        return null
      
      case 'notifications':
        router.push('/notifications')
        return null
      
      case 'settings':
        router.push('/settings')
        return null
      
      default:
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography>Página não encontrada</Typography>
          </Box>
        )
    }
  }

  if (loading) {
    return <Box p={4}><Typography>Carregando...</Typography></Box>
  }
  if (!user) {
    return <Box p={4}><Typography>Usuário não autenticado.</Typography></Box>
  }
  return (
    <MainLayout profile={profile} userName={user.name} title="Dashboard">
      {/* Conteúdo principal do dashboard, sem Drawer/AppBar locais */}
      {renderDashboardContent()}
    </MainLayout>
  )
}
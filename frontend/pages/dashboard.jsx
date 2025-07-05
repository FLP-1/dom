"use client";

/**
 * @fileoverview Dashboard principal do aplicativo DOM
 * @directory pages
 * @description Dashboard adaptativo com menu lateral para diferentes perfis de usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
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
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material'
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
import { useActiveContext } from '@/context/ActiveContext'

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
  const welcomeLabel = t('dashboard.welcome')

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

  console.log('PROFILE:', profile)
  console.log('KEY BUSCADA TASKS:', `${profile}.dashboard.tasks`)
  console.log('VALOR TASKS:', t(`${profile}.dashboard.tasks`))

  const handleAddTask = () => {
    router.push('/tasks/new')
  }

  const handleProgressClick = () => {
    router.push('/tasks')
  }

  const totalMsg = t(`${profile}.dashboard.total`)
  const totalLabel = t(`${profile}.dashboard.total`, t('dashboard.total'))
  const completedMsg = t(`${profile}.dashboard.completed`)
  const completedLabel = t(`${profile}.dashboard.completed`, t('dashboard.completed'))
  const progressMsg = t(`${profile}.dashboard.progress`)
  const progressLabel = t(`${profile}.dashboard.progress`, t('dashboard.progress'))
  const urgentMsg = t(`${profile}.dashboard.urgent`)
  const urgentLabel = t(`${profile}.dashboard.urgent`, t('dashboard.urgent'))
  const viewUrgentMsg = t(`${profile}.dashboard.view_urgent`)
  const viewUrgentLabel = t(`${profile}.dashboard.view_urgent`, t('dashboard.view_urgent'))
  const addTaskMsg = t(`${profile}.dashboard.add_task`)
  const addTaskLabel = t(`${profile}.dashboard.add_task`, t('dashboard.add_task'))

  const tasksMsg = t(`${profile}.dashboard.tasks`)
  const tasksLabel = t(`${profile}.dashboard.tasks`, t('dashboard.tasks'))

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

  console.log('PROFILE:', profile)
  console.log('KEY BUSCADA NOTIFICATIONS:', `${profile}.dashboard.notifications`)
  console.log('VALOR NOTIFICATIONS:', t(`${profile}.dashboard.notifications`))

  const handleAddNotification = () => {
    router.push('/notifications/new')
  }

  const handleUrgentClick = () => {
    router.push('/notifications?filter=urgent')
  }

  const totalMsg = t(`${profile}.dashboard.total`)
  const totalLabel = t(`${profile}.dashboard.total`, t('dashboard.total'))
  const completedMsg = t(`${profile}.dashboard.completed`)
  const completedLabel = t(`${profile}.dashboard.completed`, t('dashboard.completed'))
  const urgentMsg = t(`${profile}.dashboard.urgent`)
  const urgentLabel = t(`${profile}.dashboard.urgent`, t('dashboard.urgent'))
  const viewUrgentMsg = t(`${profile}.dashboard.view_urgent`)
  const viewUrgentLabel = t(`${profile}.dashboard.view_urgent`, t('dashboard.view_urgent'))
  const addNotificationMsg = t(`${profile}.dashboard.add_notification`)
  const addNotificationLabel = t(`${profile}.dashboard.add_notification`, t('dashboard.add_notification'))

  const notificationsMsg = t(`${profile}.dashboard.notifications`)
  const notificationsLabel = t(`${profile}.dashboard.notifications`, t('dashboard.notifications'))

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
              <Box 
                onClick={handleUrgentClick}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Chip 
                  icon={<WarningIcon />}
                  label={`${viewUrgentLabel} (${notification_stats.notificacoes_urgentes})`}
                  color="warning"
                  variant="outlined"
                  sx={{ 
                    fontSize: props.getProfileFontSize(profile, 'small'),
                    '&:hover': {
                      bgcolor: '#ff980010'
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

function HeaderInfo({ profile, getProfileFontSize }) {
  const { t } = useTranslation('common');
  const [currentTime, setCurrentTime] = useState(new Date())
  const [connectionType, setConnectionType] = useState('')
  const [location, setLocation] = useState(t('dashboard.location_loading', 'Carregando...'))
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Atualizar hora a cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Detectar tipo de conexão
    if (navigator.connection) {
      const type = navigator.connection.type || navigator.connection.effectiveType
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
          try {
            // Buscar endereço via proxy Next.js
            const response = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
            const data = await response.json()
            if (data && data.display_name) {
              setLocation(data.display_name)
            } else {
              setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
            }
          } catch (e) {
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
          }
        },
        (error) => {
          setLocation(t('dashboard.location_unavailable', 'Não disponível'))
        }
      )
    } else {
      setLocation(t('dashboard.location_unsupported', 'Não suportado'))
    }

    setIsClient(true)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

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
        color: '#ffffff80'
      }}
    >
      {isClient && (
        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small') }}>
            {formatTime(currentTime)}
          </Typography>
        </Box>
      )}
      <Box display="flex" alignItems="center" gap={1}>
        <WifiIcon sx={{ fontSize: 16, color: connectionType === 'Offline' ? '#f44336' : '#4caf50' }} />
        <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small') }}>
          {connectionType}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <LocationIcon sx={{ fontSize: 16 }} />
        <Tooltip title={location}>
          <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small'), maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {location}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
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
  const { groupId, groupName, role, profile: activeProfile, refreshTrigger } = useActiveContext()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState(null)
  
  // Usar perfil do contexto ativo se disponível, senão usar perfil do usuário
  const profile = activeProfile || user?.profile || 'empregador'
  
  // Função para buscar estatísticas do dashboard
  const fetchStats = async () => {
    setLoadingStats(true)
    setStatsError(null)
    try {
      const token = localStorage.getItem('userToken')
      const response = await fetch(`/api/dashboard/stats?profile=${profile}&user_id=user_123`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Erro ao buscar estatísticas')
      const data = await response.json()
      setDashboardStats(data)
    } catch (err) {
      setStatsError(t('dashboard.error_loading', 'Erro ao carregar estatísticas do dashboard'))
    } finally {
      setLoadingStats(false)
    }
  }

  // Recarregar dados quando o contexto mudar ou quando refreshTrigger for acionado
  useEffect(() => {
    if (groupId && groupName && role) {
      console.log('Contexto ativo mudou no dashboard:', { groupId, groupName, role, profile: activeProfile })
      // Recarregar estatísticas do dashboard
      fetchStats()
    }
  }, [groupId, groupName, role, activeProfile, refreshTrigger])

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
    localStorage.removeItem('userProfile')
    localStorage.removeItem('userToken')
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
              primary={t('dashboard.logout', 'Sair do Sistema')}
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
              setUser(userInfo)
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

  // Carregar estatísticas iniciais
  useEffect(() => {
    fetchStats()
  }, [profile])

  const renderDashboardContent = () => {
    if (loadingStats) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography sx={{ fontSize: getProfileFontSize(profile, 'medium') }}>
            {t('dashboard.loading', 'Carregando dados do dashboard...')}
          </Typography>
        </Box>
      )
    }
    if (statsError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error" sx={{ fontSize: getProfileFontSize(profile, 'medium') }}>
            {t('dashboard.error_loading', 'Erro ao carregar estatísticas do dashboard')}
          </Typography>
        </Box>
      )
    }

    switch (selectedMenu) {
      case 'dashboard':
        return (
          <Grid container spacing={3}>
            <User
              name={user.name}
              nickname={user.nickname}
              cpf={user.cpf}
              profile={profile}
              user_photo={user.user_photo}
              email={user.email}
              celular={user.celular}
              getProfileColor={getProfileColor}
              getProfileFontSize={getProfileFontSize}
              getProfileAvatarSize={getProfileAvatarSize}
            />
            <TaskStatsCard
              task_stats={dashboardStats?.task_stats}
              profile={profile}
              getProfileColor={getProfileColor}
              getProfileFontSize={getProfileFontSize}
              getProfileSpacing={getProfileSpacing}
            />
            <NotificationStatsCard
              notification_stats={dashboardStats?.notification_stats}
              profile={profile}
              getProfileColor={getProfileColor}
              getProfileFontSize={getProfileFontSize}
              getProfileSpacing={getProfileSpacing}
            />
          </Grid>
        )
      case 'tasks':
        if (typeof window !== 'undefined') window.location.href = '/tasks'
        return null
      case 'people':
        if (typeof window !== 'undefined') window.location.href = '/people'
        return null
      case 'notifications':
        if (typeof window !== 'undefined') window.location.href = '/notifications'
        return null
      case 'settings':
        if (typeof window !== 'undefined') window.location.href = '/settings'
        return null
      default:
        return null
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
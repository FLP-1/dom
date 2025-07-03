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
  const { name, cpf, profile } = props;
  const { setUser } = props;

  // Função para formatar CPF
  const formatCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={getProfileCardStyle(profile)}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ 
              bgcolor: props.getProfileColor(profile),
              width: props.getProfileAvatarSize(profile),
              height: props.getProfileAvatarSize(profile)
            }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: props.getProfileFontSize(profile, 'large') }}
              >
                {t('dashboard.welcome', 'Bem-vindo')}, {name}! 👋
              </Typography>
              <Chip 
                label={profile.charAt(0).toUpperCase() + profile.slice(1)}
                size="small"
                sx={{ 
                  bgcolor: props.getProfileColor(profile),
                  color: 'white',
                  fontSize: props.getProfileFontSize(profile, 'small')
                }}
              />
            </Box>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
          >
            CPF: {formatCPF(cpf)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function TaskStatsCard(props) {
  const { task_stats, profile } = props;
  const router = useRouter();

  const handleAddTask = () => {
    router.push('/tasks/new')
  }

  const handleProgressClick = () => {
    router.push('/tasks')
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={getProfileCardStyle(profile)}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AssignmentIcon sx={{ color: props.getProfileColor(profile) }} />
                          <Typography 
              variant="h6" 
              sx={{ fontSize: props.getProfileFontSize(profile, 'medium') }}
            >
              {t('dashboard.tasks', 'Tarefas')}
            </Typography>
            </Box>
            <Tooltip title={t('dashboard.add_task', 'Adicionar nova tarefa')} arrow>
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
                  {t('dashboard.total', 'Total')}
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
                  {t('dashboard.completed', 'Concluídas')}
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
                  {t('dashboard.progress', 'Progresso')}
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

  const handleAddNotification = () => {
    router.push('/notifications/new')
  }

  const handleUrgentClick = () => {
    router.push('/notifications?filter=urgent')
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={getProfileCardStyle(profile)}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsIcon sx={{ color: props.getProfileColor(profile) }} />
              <Typography 
                variant="h6"
                sx={{ fontSize: props.getProfileFontSize(profile, 'medium') }}
              >
                Notificações
              </Typography>
            </Box>
            <Tooltip title="Adicionar nova notificação" arrow>
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
                  sx={{ 
                    color: '#2196f3',
                    fontSize: props.getProfileFontSize(profile, 'xlarge')
                  }}
                >
                  {notification_stats?.total_notificacoes || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  Total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#f44336',
                    fontSize: props.getProfileFontSize(profile, 'xlarge')
                  }}
                >
                  {notification_stats?.notificacoes_nao_lidas || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  Não lidas
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {notification_stats?.notificacoes_urgentes > 0 && (
            <Box 
              mt={2} 
              p={1} 
              bgcolor="#fff3e0" 
              borderRadius={1}
              onClick={handleUrgentClick}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#ffe0b2'
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <WarningIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                <Typography 
                  variant="body2"
                  sx={{ fontSize: props.getProfileFontSize(profile, 'small') }}
                >
                  {notification_stats.notificacoes_urgentes} notificação(s) urgente(s)
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

function HeaderInfo({ profile, getProfileFontSize }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [wifiStatus, setWifiStatus] = useState('online')
  const [location, setLocation] = useState('Carregando...')

  useEffect(() => {
    // Atualizar hora a cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simular status do wifi
    const wifiInterval = setInterval(() => {
      setWifiStatus(navigator.onLine ? 'online' : 'offline')
    }, 5000)

    // Obter geolocalização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
        },
        (error) => {
          setLocation('Não disponível')
        }
      )
    } else {
      setLocation('Não suportado')
    }

    return () => {
      clearInterval(timeInterval)
      clearInterval(wifiInterval)
    }
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <Box display="flex" alignItems="center" gap={1}>
        <ScheduleIcon sx={{ fontSize: 16 }} />
        <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small') }}>
          {formatTime(currentTime)}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={1}>
        <WifiIcon 
          sx={{ 
            fontSize: 16,
            color: wifiStatus === 'online' ? '#4caf50' : '#f44336'
          }} 
        />
        <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small') }}>
          {wifiStatus === 'online' ? 'Online' : 'Offline'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={1}>
        <LocationIcon sx={{ fontSize: 16 }} />
        <Typography variant="body2" sx={{ fontSize: getProfileFontSize(profile, 'small') }}>
          {location}
        </Typography>
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
  
  const [profile, setProfile] = useState('empregador')
  const [user, setUser] = useState({ name: 'Usuário DOM', cpf: '00000000000', profile: 'empregador' })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState(null)

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
        p: 2, 
        backgroundColor: getProfileColor(profile),
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minHeight: 80
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
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {profile.charAt(0).toUpperCase() + profile.slice(1)}
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
              primary="Sair do Sistema"
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

  useEffect(() => {
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
        setStatsError('Erro ao carregar estatísticas do dashboard')
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [profile])

  const renderDashboardContent = () => {
    if (loadingStats) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography sx={{ fontSize: getProfileFontSize(profile, 'medium') }}>
            Carregando dados do dashboard...
          </Typography>
        </Box>
      )
    }
    if (statsError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error" sx={{ fontSize: getProfileFontSize(profile, 'medium') }}>
            {statsError}
          </Typography>
        </Box>
      )
    }
    return (
      <Grid container spacing={3}>
        <User
          name={user.name}
          cpf={user.cpf}
          profile={user.profile}
          setUser={setUser}
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
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: getProfileColor(profile),
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: '#ffffff',
                fontSize: getProfileFontSize(profile, 'large'),
                fontWeight: 'bold',
                mb: 0.5
              }}
            >
              {filteredMenuItems.find(item => item.id === selectedMenu)?.label || 'Dashboard'}
            </Typography>
            <HeaderInfo 
              profile={profile}
              getProfileFontSize={getProfileFontSize}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: getProfileSpacing(profile) === 'compact' ? 2 : getProfileSpacing(profile) === 'generous' ? 4 : 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        {renderDashboardContent()}
      </Box>
    </Box>
  )
}
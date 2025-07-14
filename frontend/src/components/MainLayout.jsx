/**
 * @fileoverview MainLayout - Layout global com menu lateral e AppBar
 * @directory src/components
 * @description Layout principal com Drawer, AppBar e children, adaptado por perfil
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Divider,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  SyncAlt as SyncAltIcon
} from '@mui/icons-material'
import Image from 'next/image'
import { getProfileColor, getProfileFontSize, getProfileIconSize, getProfileAvatarSize } from '@/theme/profile-themes'
import { useUser } from '@/context/UserContext'
import { logout } from '@/logout'

const drawerWidth = 240
const HEADER_HEIGHT = 64 // Altura padrão do AppBar MUI

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { id: 'tasks', label: 'Tarefas', icon: <AssignmentIcon />, path: '/tasks' },
  { id: 'compras', label: 'Compras', icon: <ShoppingCartIcon />, path: '/compras' },
  { id: 'people', label: 'Pessoas', icon: <PeopleIcon />, path: '/people' },
  { id: 'notifications', label: 'Notificações', icon: <NotificationsIcon />, path: '/notifications' },
  { id: 'settings', label: 'Configurações', icon: <SettingsIcon />, path: '/settings' }
]

const MainLayout = ({ children, profile = 'empregador', userName = 'Maria', avatarUrl, title }) => {
  const theme = useTheme()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const profileColor = getProfileColor(profile)
  const menuBgColor = '#fff'
  const contentBgColor = '#f5f5f5'
  const { setActiveContext, activeContext } = useUser()
  const groupName = activeContext?.groupName
  const role = activeContext?.role

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (path) => {
    router.push(path)
    setMobileOpen(false)
  }

  const handleContextChange = () => {
    // Forçar exibição do modal de seleção de contexto
    // Isso será tratado pelo ContextSelectorWrapper no _app.tsx
    localStorage.removeItem('activeContext')
    // Chamar função global para forçar exibição do modal
    if (typeof window !== 'undefined' && (window).forceShowContextModal) {
      (window).forceShowContextModal()
    }
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: menuBgColor }}>
      {/* Card de troca de contexto */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f7f7f7',
            borderRadius: 2,
            boxShadow: 1,
            cursor: 'pointer',
            mb: 2,
            p: 1,
            '&:hover': { boxShadow: 4, bgcolor: '#f0f0f0' }
          }}
          onClick={handleContextChange}
        >
          <SyncAltIcon color="primary" sx={{ mr: 1 }} />
          <Box>
                      <Typography fontWeight={600} color={profileColor} fontSize={16}>
            {profile === 'empregador' ? 'Trocar Família' : 
             profile === 'empregado' ? 'Trocar Casa' : 
             profile === 'familiar' ? 'Trocar Grupo' : 
             profile === 'parceiro' ? 'Trocar Negócio' : 
             profile === 'subordinado' ? 'Trocar Operação' : 
             profile === 'admin' ? 'Trocar Sistema' : 
             profile === 'owner' ? 'Trocar Contexto' : 'Trocar Contexto'}
          </Typography>
            {groupName && role && (
              <Typography fontSize={12} color="text.secondary">
                {groupName} - {role}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      {/* Cabeçalho do menu com logo e texto DOM */}
      <Box sx={{
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        borderBottom: `1px solid ${profileColor}30`,
        bgcolor: menuBgColor
      }}>
        <Image src="/Logo_CasaMaoCoracao.png" alt="Logo DOM" width={56} height={56} style={{ borderRadius: 12 }} />
        <Typography fontWeight={700} fontSize={32} color={profileColor} letterSpacing={2}>
          DOM
        </Typography>
      </Box>
      <Divider />
      
      <List>
        {menuItems.map(item => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={router.pathname.startsWith(item.path)}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: `${profileColor}22`,
                  '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                    color: profileColor,
                  },
                },
                '&:hover': {
                  backgroundColor: `${profileColor}18`,
                  '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                    color: profileColor,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: profileColor, fontSize: getProfileIconSize(profile) }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontSize: getProfileFontSize(profile) } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box flex={1} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.push('/login')}>
            <ListItemIcon sx={{ color: profileColor }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: contentBgColor }}>
      {/* Drawer lateral */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="menu principal">
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: menuBgColor } }}
        >
          {drawer}
        </Drawer>
        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: menuBgColor } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: profileColor, height: HEADER_HEIGHT, color: '#fff', boxShadow: 2 }}>
        <Toolbar sx={{ minHeight: HEADER_HEIGHT }}>
          <IconButton color="inherit" aria-label="abrir menu" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={700}>
            {title || 'DOM - Sistema Multiplataforma'}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Conteúdo principal */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: `${HEADER_HEIGHT}px`, bgcolor: contentBgColor }}>
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout 
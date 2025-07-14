/**
 * @fileoverview Página de pessoas
 * @directory pages/people
 * @description Página principal para gerenciamento de usuários/pessoas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Pagination,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { UserCard, UserFilters, UserStatsCards } from '@/components/people';
import { getProfileTheme } from '@/theme/profile-themes';
import { useUsers } from '@/hooks/useUsers';
import { useUserStats } from '@/hooks/useUserStats';
import { useUser } from '@/context/UserContext';
import { createUser, updateUser, deleteUser, activateUser, deactivateUser } from '@/services/userService';
import { ProtectedRoute } from '@/components/auth';



export default function PeoplePage() {
  const { user, activeContext } = useUser();
  const profile = activeContext?.profile || user?.profile || 'empregador';
  const [filters, setFilters] = useState({
    search: '',
    perfil: [],
    status: [],
    ativo: null
  });
  
  const [showStats, setShowStats] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');

  // Converter filtros para parâmetros da API
  const apiParams = {
    search: filters.search || undefined,
    perfil: filters.perfil.length > 0 ? filters.perfil.join(',') : undefined,
    status: filters.status.length > 0 ? filters.status.join(',') : undefined,
    ativo: filters.ativo !== null ? filters.ativo : undefined
  };

  const { 
    users, 
    loading: usersLoading, 
    error: usersError, 
    total, 
    page, 
    limit,
    refreshUsers,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = useUsers({ 
    token: user?.token || '', 
    params: apiParams 
  });

  // Hook para estatísticas de usuários
  const { 
    stats: userStats, 
    loading: statsLoading, 
    error: statsError, 
    refreshStats 
  } = useUserStats(user?.token || '');

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      perfil: [],
      status: [],
      ativo: null
    });
  };

  const handleCreateUser = () => {
    setDialogMode('create');
    setSelectedUser(null);
    setShowUserDialog(true);
  };

  const handleEditUser = (user) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteUser(user.token || '', user.id);
      setSuccessMessage('Usuário excluído com sucesso!');
      refreshUsers();
    } catch (err) {
      setError(err.message || 'Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (user) => {
    setLoading(true);
    try {
      await activateUser(user.token || '', user.id);
      setSuccessMessage('Usuário ativado com sucesso!');
      refreshUsers();
    } catch (err) {
      setError(err.message || 'Erro ao ativar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (user) => {
    setLoading(true);
    try {
      await deactivateUser(user.token || '', user.id);
      setSuccessMessage('Usuário desativado com sucesso!');
      refreshUsers();
    } catch (err) {
      setError(err.message || 'Erro ao desativar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    // Implementar visualização detalhada do usuário
    console.log('Visualizar usuário:', user);
  };

  const handleRefresh = () => {
    refreshUsers();
    refreshStats();
  };

  const handleCloseDialog = () => {
    setShowUserDialog(false);
    setSelectedUser(null);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const isSimpleInterface = user?.perfil === 'empregado' || user?.perfil === 'familiar';

  return (
    <ProtectedRoute allowedProfiles={['empregador', 'admin', 'owner']}>
      <MainLayout profile={profile} userName={user?.name || ''} title="Pessoas">
        <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <PeopleIcon 
                sx={{ 
                  fontSize: '32px', 
                  color: getProfileTheme(profile).primaryColor 
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  color: getProfileTheme(profile).primaryColor,
                  fontWeight: 'bold' 
                }}
              >
                Pessoas
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={usersLoading}
                size={isSimpleInterface ? 'large' : 'medium'}
              >
                Atualizar
              </Button>
              
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleCreateUser}
                size={isSimpleInterface ? 'large' : 'medium'}
              >
                Novo Usuário
              </Button>
            </Box>
          </Box>

          {/* Estatísticas */}
          {showStats && (
            <UserStatsCards 
              stats={userStats} 
              profile={user?.perfil || 'empregador'} 
              loading={statsLoading}
            />
          )}

          {/* Filtros */}
          <UserFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            profile={user?.perfil || 'empregador'}
          />

          {/* Lista de Usuários */}
          <Box sx={{ mb: 4 }}>
            {usersError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {usersError}
              </Alert>
            )}

            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum usuário encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filters.search || filters.perfil.length > 0 || filters.status.length > 0
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando um novo usuário'
                  }
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={isSimpleInterface ? 3 : 2}>
                  {users.map((userItem) => (
                    <Grid xs={12} sm={6} md={4} lg={3} key={userItem.id}>
                      <UserCard
                        user={userItem}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        onView={handleViewUser}
                        profile={user?.perfil || 'empregador'}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Paginação */}
                {total > limit && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(total / limit)}
                      page={page}
                      onChange={(_, newPage) => {
                        // Implementar navegação de página
                      }}
                      size={isSimpleInterface ? 'large' : 'medium'}
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* FAB para adicionar usuário */}
        <Fab
          color="primary"
          aria-label="adicionar usuário"
          onClick={handleCreateUser}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', md: 'none' }
          }}
        >
          <AddIcon />
        </Fab>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
    </ProtectedRoute>
  );
} 
/**
 * @fileoverview Página de grupos
 * @directory frontend/pages/groups
 * @description Página principal para gerenciamento de grupos com listagem, filtros e estatísticas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React, { useState, useCallback } from 'react'
import {
  Container,
  Typography,
  Grid,
  Box,
  Fab,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import { useTranslation } from '@/utils/i18n'

import Head from 'next/head'

import MainLayout from '@/components/MainLayout'
import { useGroups } from '@/hooks/useGroups'
import { GroupCard, GroupFilters as GroupFiltersComponent, GroupStatsCards } from '@/components/groups'
import { useUser } from '@/context/UserContext'
import { ProtectedRoute } from '@/components/auth'

const GroupsPage = () => {
  const { t } = useTranslation('common')
  const { user } = useUser()
  const {
    groups,
    loading,
    error,
    stats,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleGroupStatus,
  } = useGroups()

  // Estados locais
  const [filters, setFilters] = useState({})
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  })

  // Formulário de criação/edição
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'family' | 'work' | 'community' | 'other',
  })

  // Handlers
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    fetchGroups(newFilters)
  }, [fetchGroups])

  const handleClearFilters = useCallback(() => {
    setFilters({})
    fetchGroups()
  }, [fetchGroups])

  const handleCreateGroup = () => {
    setFormData({ name: '', description: '', type: 'family' })
    setIsCreateModalOpen(true)
  }

  const handleEditGroup = (group) => {
    setSelectedGroup(group)
    setFormData({
      name: group.name,
      description: group.description || '',
      type: group.type,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteGroup = (group) => {
    setSelectedGroup(group)
    setIsDeleteDialogOpen(true)
  }

  const handleViewGroup = (group) => {
    // TODO: Implementar visualização detalhada do grupo
    console.log('Visualizar grupo:', group)
    setSnackbar({
      open: true,
      message: t('groups.view.comingSoon'),
      severity: 'info',
    })
  }

  const handleToggleStatus = async (groupId) => {
    const success = await toggleGroupStatus(groupId)
    if (success) {
      setSnackbar({
        open: true,
        message: t('groups.status.toggleSuccess'),
        severity: 'success',
      })
    } else {
      setSnackbar({
        open: true,
        message: t('groups.status.toggleError'),
        severity: 'error',
      })
    }
  }

  const handleSubmitCreate = async () => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: t('groups.validation.nameRequired'),
        severity: 'error',
      })
      return
    }

    const newGroup = await createGroup({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
    })

    if (newGroup) {
      setIsCreateModalOpen(false)
      setSnackbar({
        open: true,
        message: t('groups.create.success'),
        severity: 'success',
      })
    } else {
      setSnackbar({
        open: true,
        message: t('groups.create.error'),
        severity: 'error',
      })
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedGroup || !formData.name.trim()) {
      setSnackbar({
        open: true,
        message: t('groups.validation.nameRequired'),
        severity: 'error',
      })
      return
    }

    const updatedGroup = await updateGroup(selectedGroup.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
    })

    if (updatedGroup) {
      setIsEditModalOpen(false)
      setSelectedGroup(null)
      setSnackbar({
        open: true,
        message: t('groups.update.success'),
        severity: 'success',
      })
    } else {
      setSnackbar({
        open: true,
        message: t('groups.update.error'),
        severity: 'error',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedGroup) return

    const success = await deleteGroup(selectedGroup.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setSelectedGroup(null)
      setSnackbar({
        open: true,
        message: t('groups.delete.success'),
        severity: 'success',
      })
    } else {
      setSnackbar({
        open: true,
        message: t('groups.delete.error'),
        severity: 'error',
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <ProtectedRoute allowedProfiles={['empregador', 'parceiro', 'admin', 'owner']}>
      <>
        <Head>
          <title>{t('groups.page.title')} - DOM v1</title>
          <meta name="description" content={t('groups.page.description')} />
        </Head>

        <MainLayout>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <GroupIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                {t('groups.page.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('groups.page.subtitle')}
              </Typography>
            </Box>
          </Box>

          {/* Estatísticas */}
          <GroupStatsCards stats={stats} loading={loading} />

          {/* Filtros */}
          <GroupFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Lista de grupos */}
          <Box sx={{ mb: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : groups.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('groups.empty.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('groups.empty.description')}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {groups.map((group) => (
                  <Grid xs={12} sm={6} md={4} lg={3} key={group.id}>
                    <GroupCard
                      group={group}
                      onEdit={handleEditGroup}
                      onDelete={handleDeleteGroup}
                      onView={handleViewGroup}
                      onToggleStatus={handleToggleStatus}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* FAB para criar grupo */}
          <Tooltip title={t('groups.create.title')}>
            <Fab
              color="primary"
              aria-label={t('groups.create.title')}
              onClick={handleCreateGroup}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>

          {/* Modal de criação */}
          <Dialog
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>{t('groups.create.title')}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  fullWidth
                  label={t('groups.form.name')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                
                <TextField
                  fullWidth
                  label={t('groups.form.description')}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={3}
                />
                
                <FormControl fullWidth>
                  <InputLabel>{t('groups.form.type')}</InputLabel>
                  <Select
                    value={formData.type}
                    label={t('groups.form.type')}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <MenuItem value="family">{t('groups.types.family')}</MenuItem>
                    <MenuItem value="work">{t('groups.types.work')}</MenuItem>
                    <MenuItem value="community">{t('groups.types.community')}</MenuItem>
                    <MenuItem value="other">{t('groups.types.other')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsCreateModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSubmitCreate} variant="contained">
                {t('common.create')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal de edição */}
          <Dialog
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>{t('groups.edit.title')}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  fullWidth
                  label={t('groups.form.name')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                
                <TextField
                  fullWidth
                  label={t('groups.form.description')}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={3}
                />
                
                <FormControl fullWidth>
                  <InputLabel>{t('groups.form.type')}</InputLabel>
                  <Select
                    value={formData.type}
                    label={t('groups.form.type')}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <MenuItem value="family">{t('groups.types.family')}</MenuItem>
                    <MenuItem value="work">{t('groups.types.work')}</MenuItem>
                    <MenuItem value="community">{t('groups.types.community')}</MenuItem>
                    <MenuItem value="other">{t('groups.types.other')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsEditModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSubmitEdit} variant="contained">
                {t('common.save')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog de confirmação de exclusão */}
          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          >
            <DialogTitle>{t('groups.delete.confirmTitle')}</DialogTitle>
            <DialogContent>
              <Typography>
                {t('groups.delete.confirmMessage', { name: selectedGroup?.name })}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">
                {t('common.delete')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para mensagens */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </MainLayout>
      </>
    </ProtectedRoute>
  )
}

export default GroupsPage 
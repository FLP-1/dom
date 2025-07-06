/**
 * @fileoverview Filtros de grupos
 * @directory frontend/src/components/groups
 * @description Componente para filtrar grupos por tipo, status, busca e quantidade de membros
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import React, { memo, useState, useEffect } from 'react'
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  IconButton,
  Collapse,
  Tooltip,
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
import { GroupFilters } from '@/hooks/useGroups'

const GroupFiltersComponent = memo(({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {}
    setLocalFilters(clearedFilters)
    onClearFilters()
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Header dos filtros */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" component="h2">
            {t('groups.filters.title')}
          </Typography>
          {hasActiveFilters && (
            <Tooltip title={t('groups.filters.active')}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                }}
              />
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            startIcon={<FilterIcon />}
          >
            {expanded ? t('common.hide') : t('common.show')}
          </Button>
          
          {hasActiveFilters && (
            <Tooltip title={t('groups.filters.clear')}>
              <IconButton
                size="small"
                onClick={handleClearFilters}
                color="error"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Filtros expandidos */}
      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Busca */}
          <TextField
            fullWidth
            label={t('groups.filters.search')}
            placeholder={t('groups.filters.searchPlaceholder')}
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
          />

          {/* Tipo e Status */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('groups.filters.type')}</InputLabel>
              <Select
                value={localFilters.type || ''}
                label={t('groups.filters.type')}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="family">{t('groups.types.family')}</MenuItem>
                <MenuItem value="work">{t('groups.types.work')}</MenuItem>
                <MenuItem value="community">{t('groups.types.community')}</MenuItem>
                <MenuItem value="other">{t('groups.types.other')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('groups.filters.status')}</InputLabel>
              <Select
                value={localFilters.status || ''}
                label={t('groups.filters.status')}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">{t('common.all')}</MenuItem>
                <MenuItem value="active">{t('groups.status.active')}</MenuItem>
                <MenuItem value="inactive">{t('groups.status.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Quantidade de membros */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('groups.filters.memberCount')}
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[
                  localFilters.min_members || 0,
                  localFilters.max_members || 100
                ]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue
                  handleFilterChange('min_members', min)
                  handleFilterChange('max_members', max)
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                  { value: 75, label: '75' },
                  { value: 100, label: '100+' },
                ]}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {localFilters.min_members || 0} - {localFilters.max_members || 100}+ {t('groups.members')}
              </Typography>
            </Box>
          </Box>

          {/* Botões de ação */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              {t('common.clear')}
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              startIcon={<FilterIcon />}
            >
              {t('common.apply')}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  )
})

GroupFiltersComponent.displayName = 'GroupFilters'

export default GroupFiltersComponent 
/**
 * @fileoverview Filtros de usuários
 * @directory src/components/people
 * @description Componente para filtrar lista de usuários
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const profileOptions = [
  { value: 'empregador', label: 'Empregador' },
  { value: 'empregado', label: 'Empregado' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'parceiro', label: 'Parceiro' },
  { value: 'subordinado', label: 'Subordinado' },
  { value: 'admin', label: 'Administrador' },
  { value: 'owner', label: 'Proprietário' }
];

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'blocked', label: 'Bloqueado' }
];

export const UserFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  profile
}) => {
  const [expanded, setExpanded] = useState(false);
  const isSimpleInterface = profile === 'empregado' || profile === 'familiar';

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleProfileChange = (event) => {
    const value = event.target.value;
    handleFilterChange('perfil', typeof value === 'string' ? value.split(',') : value);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    handleFilterChange('status', typeof value === 'string' ? value.split(',') : value);
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.perfil.length > 0 ||
      filters.status.length > 0 ||
      filters.ativo !== null
    );
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header dos filtros */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Filtros
            </Typography>
            {hasActiveFilters() && (
              <Chip
                label="Ativos"
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasActiveFilters() && (
              <Tooltip title="Limpar filtros">
                <IconButton
                  size={isSimpleInterface ? 'large' : 'medium'}
                  onClick={clearAllFilters}
                  color="error"
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title={expanded ? 'Recolher filtros' : 'Expandir filtros'}>
              <IconButton
                size={isSimpleInterface ? 'large' : 'medium'}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Busca sempre visível */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nome, email ou CPF..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            size={isSimpleInterface ? 'large' : 'medium'}
          />
        </Box>

        {/* Filtros expandidos */}
        <Collapse in={expanded}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            {/* Filtro por perfil */}
            <FormControl fullWidth size={isSimpleInterface ? 'large' : 'medium'}>
              <InputLabel>Perfil</InputLabel>
              <Select
                multiple
                value={filters.perfil}
                onChange={handleProfileChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={profileOptions.find(p => p.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {profileOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por status */}
            <FormControl fullWidth size={isSimpleInterface ? 'large' : 'medium'}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filters.status}
                onChange={handleStatusChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={statusOptions.find(s => s.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por ativo/inativo */}
            <FormControl fullWidth size={isSimpleInterface ? 'large' : 'medium'}>
              <InputLabel>Ativo</InputLabel>
              <Select
                value={filters.ativo === null ? '' : filters.ativo}
                onChange={(e) => handleFilterChange('ativo', e.target.value === '' ? null : e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={true}>Ativo</MenuItem>
                <MenuItem value={false}>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Collapse>

        {/* Filtros ativos */}
        {hasActiveFilters() && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.search && (
              <Chip
                label={`Busca: ${filters.search}`}
                onDelete={() => handleFilterChange('search', '')}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.perfil.map((perfil) => (
              <Chip
                key={perfil}
                label={`Perfil: ${profileOptions.find(p => p.value === perfil)?.label}`}
                onDelete={() => handleFilterChange('perfil', filters.perfil.filter(p => p !== perfil))}
                color="primary"
                variant="outlined"
              />
            ))}
            
            {filters.status.map((status) => (
              <Chip
                key={status}
                label={`Status: ${statusOptions.find(s => s.value === status)?.label}`}
                onDelete={() => handleFilterChange('status', filters.status.filter(s => s !== status))}
                color="primary"
                variant="outlined"
              />
            ))}
            
            {filters.ativo !== null && (
              <Chip
                label={`Ativo: ${filters.ativo ? 'Sim' : 'Não'}`}
                onDelete={() => handleFilterChange('ativo', null)}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 
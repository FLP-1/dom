/**
 * @fileoverview Card de usuário
 * @directory src/components/people
 * @description Componente para exibir informações de usuário em card
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Box,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';

const getProfileColor = (perfil) => {
  const colors = {
    empregador: '#1976d2',
    empregado: '#388e3c',
    familiar: '#f57c00',
    parceiro: '#7b1fa2',
    subordinado: '#d32f2f',
    admin: '#c62828',
    owner: '#1a237e'
  };
  return colors[perfil] || '#757575';
};

const getProfileLabel = (perfil) => {
  const labels = {
    empregador: 'Empregador',
    empregado: 'Empregado',
    familiar: 'Familiar',
    parceiro: 'Parceiro',
    subordinado: 'Subordinado',
    admin: 'Administrador',
    owner: 'Proprietário'
  };
  return labels[perfil] || perfil;
};

const getStatusIcon = (ativo) => {
  return ativo ? (
    <ActiveIcon color="success" fontSize="small" />
  ) : (
    <InactiveIcon color="error" fontSize="small" />
  );
};

const getStatusColor = (ativo) => {
  return ativo ? '#4caf50' : '#f44336';
};

export const UserCard = ({
  user,
  onEdit,
  onDelete,
  onView,
  profile
}) => {
  const isSimpleInterface = profile === 'empregado' || profile === 'familiar';
  const cardSize = isSimpleInterface ? 'large' : 'medium';

  return (
    <Card 
      sx={{ 
        minHeight: isSimpleInterface ? 280 : 240,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: isSimpleInterface ? 3 : 2 }}>
        {/* Header com avatar e status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={getStatusIcon(user.ativo)}
          >
            <Avatar
              src={user.user_photo}
              sx={{ 
                width: isSimpleInterface ? 80 : 60, 
                height: isSimpleInterface ? 80 : 60,
                bgcolor: getProfileColor(user.perfil)
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Typography 
              variant={isSimpleInterface ? 'h6' : 'subtitle1'} 
              component="h3"
              sx={{ fontWeight: 'bold', mb: 0.5 }}
            >
              {user.name}
            </Typography>
            
            {user.nickname && (
              <Typography variant="body2" color="text.secondary">
                @{user.nickname}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Informações do usuário */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getProfileLabel(user.perfil)}
            size={isSimpleInterface ? 'medium' : 'small'}
            sx={{
              bgcolor: getProfileColor(user.perfil),
              color: 'white',
              fontWeight: 'bold',
              mb: 1
            }}
          />
          
          <Chip
            label={user.ativo ? 'Ativo' : 'Inativo'}
            size={isSimpleInterface ? 'medium' : 'small'}
            sx={{
              bgcolor: getStatusColor(user.ativo),
              color: 'white',
              ml: 1
            }}
          />
        </Box>

        {/* Detalhes de contato */}
        <Box sx={{ space: 1 }}>
          {user.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}
          
          {user.celular && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {user.celular}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              CPF: {user.cpf}
            </Typography>
          </Box>
        </Box>

        {/* Grupos */}
        {user.grupos && user.grupos.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Grupos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.grupos.slice(0, 2).map((grupo) => (
                <Chip
                  key={grupo.id}
                  label={grupo.nome}
                  size="small"
                  variant="outlined"
                />
              ))}
              {user.grupos.length > 2 && (
                <Chip
                  label={`+${user.grupos.length - 2}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Ações */}
      <CardActions sx={{ p: isSimpleInterface ? 2 : 1, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          {onView && (
            <Tooltip title="Ver detalhes">
              <IconButton
                size={isSimpleInterface ? 'large' : 'medium'}
                onClick={() => onView(user)}
                color="primary"
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onEdit && (
            <Tooltip title="Editar">
              <IconButton
                size={isSimpleInterface ? 'large' : 'medium'}
                onClick={() => onEdit(user)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onDelete && (
            <Tooltip title="Excluir">
              <IconButton
                size={isSimpleInterface ? 'large' : 'medium'}
                onClick={() => onDelete(user)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}; 
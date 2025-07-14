/**
 * @fileoverview Cards de estatísticas de usuários
 * @directory src/components/people
 * @description Componente para exibir estatísticas de usuários
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React from 'react';
import { useTranslation } from '@/utils/i18n';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  TrendingUp as TrendingIcon,
  Wifi as OnlineIcon
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
    empregador: 'Empregadores',
    empregado: 'Empregados',
    familiar: 'Familiares',
    parceiro: 'Parceiros',
    subordinado: 'Subordinados',
    admin: 'Administradores',
    owner: 'Proprietários'
  };
  return labels[perfil] || perfil;
};

export const UserStatsCards = ({ stats, profile, loading = false }) => {
  const { t } = useTranslation('common');
  const isSimpleInterface = profile === 'empregado' || profile === 'familiar';
  const cardPadding = isSimpleInterface ? 3 : 2;

  // Se stats for null ou loading, mostrar dados padrão
  const safeStats = stats || {
    total_usuarios: 0,
    usuarios_ativos: 0,
    usuarios_inativos: 0,
    usuarios_por_perfil: {},
    novos_usuarios_mes: 0,
    usuarios_online: 0
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    subtitle, 
    progress 
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: cardPadding }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: color,
              color: 'white',
              borderRadius: 2,
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant={isSimpleInterface ? 'h6' : 'subtitle2'} 
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography 
              variant={isSimpleInterface ? 'h4' : 'h5'} 
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              {value.toLocaleString('pt-BR')}
            </Typography>
          </Box>
        </Box>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progresso
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: color
                }
              }} 
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const totalAtivosPercent = safeStats.total_usuarios > 0 
    ? Math.round((safeStats.usuarios_ativos / safeStats.total_usuarios) * 100) 
    : 0;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant={isSimpleInterface ? 'h5' : 'h6'} 
        component="h2" 
        sx={{ mb: 3, fontWeight: 'bold' }}
      >
        {t('users.stats.title', 'Estatísticas de Usuários')}
      </Typography>
      
      <Grid container spacing={isSimpleInterface ? 3 : 2}>
        {/* Total de Usuários */}
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t('users.stats.total', 'Total de Usuários')}
            value={safeStats.total_usuarios}
            icon={<PeopleIcon />}
            color="#1976d2"
            subtitle={t('users.stats.total_subtitle', 'Todos os usuários cadastrados')}
          />
        </Grid>

        {/* Usuários Ativos */}
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t('users.stats.active', 'Usuários Ativos')}
            value={safeStats.usuarios_ativos}
            icon={<ActiveIcon />}
            color="#4caf50"
            subtitle={t('users.stats.active_subtitle', 'Usuários com acesso ativo')}
            progress={totalAtivosPercent}
          />
        </Grid>

        {/* Novos Usuários */}
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t('users.stats.new_month', 'Novos este Mês')}
            value={safeStats.novos_usuarios_mes}
            icon={<PersonAddIcon />}
            color="#ff9800"
            subtitle={t('users.stats.new_month_subtitle', 'Novos cadastros no mês')}
          />
        </Grid>

        {/* Usuários Online */}
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t('users.stats.online', 'Usuários Online')}
            value={safeStats.usuarios_online}
            icon={<OnlineIcon />}
            color="#9c27b0"
            subtitle={t('users.stats.online_subtitle', 'Usuários ativos agora')}
          />
        </Grid>
      </Grid>

      {/* Distribuição por Perfil */}
      <Box sx={{ mt: 4 }}>
        <Typography 
          variant={isSimpleInterface ? 'h6' : 'subtitle1'} 
          component="h3" 
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Distribuição por Perfil
        </Typography>
        
        <Grid container spacing={2}>
          {Object.entries(safeStats.usuarios_por_perfil).map(([perfil, count]) => {
            const percent = safeStats.total_usuarios > 0 
              ? Math.round((count / safeStats.total_usuarios) * 100) 
              : 0;
            
            return (
              <Grid xs={12} sm={6} md={4} key={perfil}>
                <Card>
                  <CardContent sx={{ p: cardPadding }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: getProfileColor(perfil),
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {getProfileLabel(perfil)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                      {count}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={percent} 
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getProfileColor(perfil)
                            }
                          }} 
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {percent}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}; 
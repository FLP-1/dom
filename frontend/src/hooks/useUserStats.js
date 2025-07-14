/**
 * @fileoverview Hook para estatísticas de usuários
 * @directory src/hooks
 * @description Hook React para consumir estatísticas de usuários do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import { useState, useEffect } from 'react';

export function useUserStats(token) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setStats(null);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/users/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setStats(result.data);
        } else {
          throw new Error(result.message || 'Erro ao buscar estatísticas');
        }
      } catch (err) {
        console.error('Erro ao buscar estatísticas de usuários:', err);
        setError(err.message || 'Erro ao carregar estatísticas');
        setStats({
          total_usuarios: 0,
          usuarios_ativos: 0,
          usuarios_inativos: 0,
          usuarios_por_perfil: {},
          novos_usuarios_mes: 0,
          usuarios_online: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const refreshStats = () => {
    if (token) {
      setLoading(true);
      setError(null);
      // O useEffect será acionado novamente
    }
  };

  return { 
    stats, 
    loading, 
    error, 
    refreshStats 
  };
} 
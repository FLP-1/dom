/**
 * @fileoverview Hook para estatísticas de tarefas
 * @directory src/hooks
 * @description Hook React para consumir estatísticas de tarefas do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export function useTaskStats(profile = 'empregador') {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          profile,
          user_id: user.id || ''
        });
        
        const response = await fetch(`/api/dashboard/stats?${params}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error('Erro ao buscar estatísticas');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.token, user?.id, profile]);

  return { stats, loading, error };
} 
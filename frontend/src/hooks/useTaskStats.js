/**
 * @fileoverview Hook para estatísticas de tarefas
 * @directory src/hooks
 * @description Hook React para consumir estatísticas de tarefas do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */
import { useState, useEffect } from 'react';
import { getTaskStats } from '@/services/taskService';

export function useTaskStats({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getTaskStats(token)
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [token]);

  return { stats, loading, error };
} 
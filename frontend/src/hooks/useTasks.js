/**
 * @fileoverview Hook para tarefas
 * @directory src/hooks
 * @description Hook React para consumir tarefas do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */
import { useState, useEffect } from 'react';
import { getTasks } from '@/services/taskService';

export function useTasks({ token, params = {} }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getTasks(token, params)
      .then((data) => setTasks(data.tasks))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [token, JSON.stringify(params)]);

  return { tasks, loading, error };
} 
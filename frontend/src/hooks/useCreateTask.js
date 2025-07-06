/**
 * @fileoverview Hook para criação de tarefas
 * @directory src/hooks
 * @description Hook React para criar tarefas no backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */
import { useState } from 'react';
import { createTask } from '@/services/taskService';

export function useCreateTask({ token, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const task = await createTask(token, taskData);
      if (onSuccess) onSuccess(task);
      return task;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTask: handleCreate, loading, error };
} 
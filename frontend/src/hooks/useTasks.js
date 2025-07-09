/**
 * @fileoverview Hook para tarefas
 * @directory src/hooks
 * @description Hook React para consumir tarefas do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useMessageSnackbar } from '@/hooks/useMessageSnackbar';

/**
 * Hook para gerenciar tarefas
 * @param {string} profile - Perfil do usuário
 * @param {boolean} autoFetch - Se deve buscar tarefas automaticamente
 * @returns {Object} Estado e funções para gerenciar tarefas
 */
export function useTasks(profile = 'empregador', autoFetch = true) {
  const { t } = useTranslation();
  const { showMessage } = useMessageSnackbar();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
  });

  // Calcular estatísticas
  const calculateStats = useCallback((taskList) => {
    const now = new Date();
    const stats = {
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'pending').length,
      in_progress: taskList.filter(t => t.status === 'in_progress').length,
      completed: taskList.filter(t => t.status === 'completed').length,
      overdue: taskList.filter(t => 
        t.status !== 'completed' && 
        t.dueDate && 
        new Date(t.dueDate) < now
      ).length,
    };
    setStats(stats);
    return stats;
  }, []);

  // Buscar tarefas
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        profile,
        ...filters
      });
      
      const response = await fetch(`/api/tasks?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || data);
        calculateStats(data.tasks || data);
      } else {
        throw new Error(data.message || t('tasks.fetch_error', 'Erro ao buscar tarefas'));
      }
    } catch (err) {
      setError(err.message);
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [profile, calculateStats, t, showMessage]);

  // Criar tarefa
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData, profile }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const newTask = data.task || data;
        setTasks(prev => [...prev, newTask]);
        calculateStats([...tasks, newTask]);
        showMessage(t('tasks.create_success', 'Tarefa criada com sucesso'), 'success');
        return newTask;
      } else {
        throw new Error(data.message || t('tasks.create_error', 'Erro ao criar tarefa'));
      }
    } catch (err) {
      setError(err.message);
      showMessage(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, tasks, calculateStats, t, showMessage]);

  // Atualizar tarefa
  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updateData, profile }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const updatedTask = data.task || data;
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        calculateStats(tasks.map(t => t.id === taskId ? updatedTask : t));
        showMessage(t('tasks.update_success', 'Tarefa atualizada com sucesso'), 'success');
        return updatedTask;
      } else {
        throw new Error(data.message || t('tasks.update_error', 'Erro ao atualizar tarefa'));
      }
    } catch (err) {
      setError(err.message);
      showMessage(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, tasks, calculateStats, t, showMessage]);

  // Deletar tarefa
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        calculateStats(tasks.filter(t => t.id !== taskId));
        showMessage(t('tasks.delete_success', 'Tarefa excluída com sucesso'), 'success');
        return true;
      } else {
        throw new Error(data.message || t('tasks.delete_error', 'Erro ao excluir tarefa'));
      }
    } catch (err) {
      setError(err.message);
      showMessage(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, tasks, calculateStats, t, showMessage]);

  // Alternar status da tarefa
  const toggleTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, profile }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const updatedTask = data.task || data;
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        calculateStats(tasks.map(t => t.id === taskId ? updatedTask : t));
        showMessage(t('tasks.status_success', 'Status atualizado com sucesso'), 'success');
        return updatedTask;
      } else {
        throw new Error(data.message || t('tasks.status_error', 'Erro ao alterar status da tarefa'));
      }
    } catch (err) {
      setError(err.message);
      showMessage(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, tasks, calculateStats, t, showMessage]);

  // Buscar tarefa por ID
  const getTaskById = useCallback((taskId) => {
    return tasks.find(t => t.id === taskId) || null;
  }, [tasks]);

  // Filtrar tarefas
  const filterTasks = useCallback((filters = {}) => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.responsibleId && task.responsibleId !== filters.responsibleId) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.createdBy && task.createdBy !== filters.createdBy) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          task.title?.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search) ||
          task.notes?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [tasks]);

  // Buscar tarefas automaticamente ao montar
  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [fetchTasks, autoFetch]);

  return {
    tasks,
    loading,
    error,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTaskById,
    filterTasks,
  };
} 
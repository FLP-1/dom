/**
 * @fileoverview Serviço de tarefas (API)
 * @directory src/services
 * @description Funções para consumir a API de tarefas do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */
import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getTasks = async (token, params = {}) => {
  const { data } = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

export const createTask = async (token, task) => {
  const { data } = await axios.post(`${API_URL}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateTask = async (token, taskId, task) => {
  const { data } = await axios.put(`${API_URL}/tasks/${taskId}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteTask = async (token, taskId) => {
  const { data } = await axios.delete(`${API_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateTaskStatus = async (token, taskId, status) => {
  const { data } = await axios.patch(`${API_URL}/tasks/${taskId}/status?status=${status}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getTaskStats = async (token) => {
  const { data } = await axios.get(`${API_URL}/tasks/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}; 
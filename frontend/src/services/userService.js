/**
 * @fileoverview Serviço de usuários/pessoas
 * @directory src/services
 * @description Funções para consumir a API de usuários do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getUsers = async (token, params = {}) => {
  const { data } = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

export const getUser = async (token, userId) => {
  const { data } = await axios.get(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createUser = async (token, user) => {
  const { data } = await axios.post(`${API_URL}/users`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateUser = async (token, userId, user) => {
  const { data } = await axios.put(`${API_URL}/users/${userId}`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteUser = async (token, userId) => {
  const { data } = await axios.delete(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const activateUser = async (token, userId) => {
  const { data } = await axios.patch(`${API_URL}/users/${userId}/activate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deactivateUser = async (token, userId) => {
  const { data } = await axios.patch(`${API_URL}/users/${userId}/deactivate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getUserStats = async (token) => {
  const { data } = await axios.get(`${API_URL}/users/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
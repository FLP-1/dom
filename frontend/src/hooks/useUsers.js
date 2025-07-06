/**
 * @fileoverview Hook para usuários/pessoas
 * @directory src/hooks
 * @description Hook React para consumir usuários do backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import { useState, useEffect } from 'react';
import { getUsers } from '@/services/userService';
import { UserApi } from '@/types/users';
import { UserQueryParams } from '@/types/api';

export function useUsers({ token, params = {} }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    const queryParams = {
      ...params,
      limit,
      offset: (page - 1) * limit
    };

    getUsers(token, queryParams)
      .then((data) => {
        setUsers(data.items || data.users || []);
        setTotal(data.total || 0);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar usuários');
        setUsers([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [token, JSON.stringify(params), page, limit]);

  const refreshUsers = () => {
    setPage(1);
  };

  const nextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return { 
    users, 
    loading, 
    error, 
    total, 
    page, 
    limit,
    refreshUsers,
    nextPage,
    prevPage,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1
  };
} 
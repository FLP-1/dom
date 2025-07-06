/**
 * @fileoverview Hook para gerenciar Snackbar de mensagens
 * @directory src/hooks
 * @description Hook reutilizável para exibir mensagens centralizadas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';
import { useMessages, MessageCategory } from '@/utils/messages';

export const useMessageSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const { task, success, error, common } = useMessages();

  const showMessage = useCallback((message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const showTaskMessage = useCallback((
    key, 
    severity = 'info', 
    variables
  ) => {
    setSnackbar({
      open: true,
      message: task(key, variables),
      severity
    });
  }, [task]);

  const showSuccessMessage = useCallback((
    key, 
    variables
  ) => {
    setSnackbar({
      open: true,
      message: success(key, variables),
      severity: 'success'
    });
  }, [success]);

  const showErrorMessage = useCallback((
    key, 
    variables
  ) => {
    setSnackbar({
      open: true,
      message: error(key, variables),
      severity: 'error'
    });
  }, [error]);

  const showCommonMessage = useCallback((
    key, 
    severity = 'info', 
    variables
  ) => {
    setSnackbar({
      open: true,
      message: common(key, variables),
      severity
    });
  }, [common]);

  const hideMessage = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  return {
    snackbar,
    showMessage,
    showTaskMessage,
    showSuccessMessage,
    showErrorMessage,
    showCommonMessage,
    hideMessage
  };
}; 
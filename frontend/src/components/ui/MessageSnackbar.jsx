/**
 * @fileoverview Componente Snackbar reutilizável
 * @directory src/components/ui
 * @description Snackbar com mensagens centralizadas e tipos de alerta
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useMessages, MessageCategory } from '@/utils/messages';

const MessageSnackbar = ({
  open,
  message,
  severity = 'info',
  autoHideDuration = 6000,
  onClose,
  category,
  messageKey,
  variables
}) => {
  const { t } = useMessages();

  // Se fornecido category e messageKey, usar sistema de mensagens centralizado
  const displayMessage = category && messageKey 
    ? t(category, messageKey, variables)
    : message;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {displayMessage}
      </Alert>
    </Snackbar>
  );
};

export default MessageSnackbar; 
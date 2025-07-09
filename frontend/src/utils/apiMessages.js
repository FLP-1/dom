/**
 * @fileoverview Mensagens centralizadas para APIs
 * @directory src/utils
 * @description Serviço para gerenciar mensagens de APIs com suporte a múltiplos idiomas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export const apiMessages = {
  'pt-BR': {
    // Autenticação
    'token_not_provided': 'Token de autenticação não fornecido',
    'token_invalid': 'Token de autenticação inválido',
    'token_expired': 'Token de autenticação expirado',
    'refresh_error': 'Erro ao renovar token',
    'refresh_success': 'Token renovado com sucesso',
    'logout_success': 'Logout realizado com sucesso',
    'logout_error': 'Erro ao realizar logout',
    
    // Usuários
    'user_not_found': 'Usuário não encontrado',
    'user_created': 'Usuário criado com sucesso',
    'user_updated': 'Usuário atualizado com sucesso',
    'user_deleted': 'Usuário removido com sucesso',
    'user_exists': 'Usuário já existe',
    'invalid_credentials': 'Credenciais inválidas',
    
    // Tarefas
    'task_not_found': 'Tarefa não encontrada',
    'task_created': 'Tarefa criada com sucesso',
    'task_updated': 'Tarefa atualizada com sucesso',
    'task_deleted': 'Tarefa removida com sucesso',
    'task_status_updated': 'Status da tarefa atualizado',
    
    // Grupos
    'group_not_found': 'Grupo não encontrado',
    'group_created': 'Grupo criado com sucesso',
    'group_updated': 'Grupo atualizado com sucesso',
    'group_deleted': 'Grupo removido com sucesso',
    'user_added_to_group': 'Usuário adicionado ao grupo',
    'user_removed_from_group': 'Usuário removido do grupo',
    
    // Notificações
    'notification_not_found': 'Notificação não encontrada',
    'notification_created': 'Notificação criada com sucesso',
    'notification_updated': 'Notificação atualizada com sucesso',
    'notification_deleted': 'Notificação removida com sucesso',
    'notification_marked_read': 'Notificação marcada como lida',
    'all_notifications_marked_read': 'Todas as notificações marcadas como lidas',
    
    // Validação
    'validation_error': 'Erro de validação',
    'required_field': 'Campo obrigatório',
    'invalid_email': 'E-mail inválido',
    'invalid_cpf': 'CPF inválido',
    'invalid_phone': 'Telefone inválido',
    'password_too_short': 'Senha muito curta',
    'password_mismatch': 'Senhas não coincidem',
    
    // Permissões
    'permission_denied': 'Permissão negada',
    'insufficient_permissions': 'Permissões insuficientes',
    'admin_required': 'Acesso de administrador necessário',
    'owner_required': 'Acesso de proprietário necessário',
    
    // Erros gerais
    'server_error': 'Erro interno do servidor',
    'network_error': 'Erro de conexão',
    'timeout_error': 'Tempo limite excedido',
    'not_found': 'Recurso não encontrado',
    'method_not_allowed': 'Método não permitido',
    'bad_request': 'Requisição inválida',
    'conflict': 'Conflito de dados',
    'too_many_requests': 'Muitas requisições',
    
    // Sucesso
    'operation_success': 'Operação realizada com sucesso',
    'data_saved': 'Dados salvos com sucesso',
    'data_updated': 'Dados atualizados com sucesso',
    'data_deleted': 'Dados removidos com sucesso',
    'changes_saved': 'Alterações salvas com sucesso'
  },
  'en': {
    // Authentication
    'token_not_provided': 'Authentication token not provided',
    'token_invalid': 'Invalid authentication token',
    'token_expired': 'Authentication token expired',
    'refresh_error': 'Error refreshing token',
    'refresh_success': 'Token refreshed successfully',
    'logout_success': 'Logout successful',
    'logout_error': 'Error during logout',
    
    // Users
    'user_not_found': 'User not found',
    'user_created': 'User created successfully',
    'user_updated': 'User updated successfully',
    'user_deleted': 'User deleted successfully',
    'user_exists': 'User already exists',
    'invalid_credentials': 'Invalid credentials',
    
    // Tasks
    'task_not_found': 'Task not found',
    'task_created': 'Task created successfully',
    'task_updated': 'Task updated successfully',
    'task_deleted': 'Task deleted successfully',
    'task_status_updated': 'Task status updated',
    
    // Groups
    'group_not_found': 'Group not found',
    'group_created': 'Group created successfully',
    'group_updated': 'Group updated successfully',
    'group_deleted': 'Group deleted successfully',
    'user_added_to_group': 'User added to group',
    'user_removed_from_group': 'User removed from group',
    
    // Notifications
    'notification_not_found': 'Notification not found',
    'notification_created': 'Notification created successfully',
    'notification_updated': 'Notification updated successfully',
    'notification_deleted': 'Notification deleted successfully',
    'notification_marked_read': 'Notification marked as read',
    'all_notifications_marked_read': 'All notifications marked as read',
    
    // Validation
    'validation_error': 'Validation error',
    'required_field': 'Required field',
    'invalid_email': 'Invalid email',
    'invalid_cpf': 'Invalid CPF',
    'invalid_phone': 'Invalid phone number',
    'password_too_short': 'Password too short',
    'password_mismatch': 'Passwords do not match',
    
    // Permissions
    'permission_denied': 'Permission denied',
    'insufficient_permissions': 'Insufficient permissions',
    'admin_required': 'Admin access required',
    'owner_required': 'Owner access required',
    
    // General errors
    'server_error': 'Internal server error',
    'network_error': 'Connection error',
    'timeout_error': 'Timeout exceeded',
    'not_found': 'Resource not found',
    'method_not_allowed': 'Method not allowed',
    'bad_request': 'Bad request',
    'conflict': 'Data conflict',
    'too_many_requests': 'Too many requests',
    
    // Success
    'operation_success': 'Operation completed successfully',
    'data_saved': 'Data saved successfully',
    'data_updated': 'Data updated successfully',
    'data_deleted': 'Data deleted successfully',
    'changes_saved': 'Changes saved successfully'
  },
  'es': {
    // Autenticación
    'token_not_provided': 'Token de autenticación no proporcionado',
    'token_invalid': 'Token de autenticación inválido',
    'token_expired': 'Token de autenticación expirado',
    'refresh_error': 'Error al renovar el token',
    'refresh_success': 'Token renovado exitosamente',
    'logout_success': 'Cierre de sesión exitoso',
    'logout_error': 'Error durante el cierre de sesión',
    
    // Usuarios
    'user_not_found': 'Usuario no encontrado',
    'user_created': 'Usuario creado exitosamente',
    'user_updated': 'Usuario actualizado exitosamente',
    'user_deleted': 'Usuario eliminado exitosamente',
    'user_exists': 'El usuario ya existe',
    'invalid_credentials': 'Credenciales inválidas',
    
    // Tareas
    'task_not_found': 'Tarea no encontrada',
    'task_created': 'Tarea creada exitosamente',
    'task_updated': 'Tarea actualizada exitosamente',
    'task_deleted': 'Tarea eliminada exitosamente',
    'task_status_updated': 'Estado de la tarea actualizado',
    
    // Grupos
    'group_not_found': 'Grupo no encontrado',
    'group_created': 'Grupo creado exitosamente',
    'group_updated': 'Grupo actualizado exitosamente',
    'group_deleted': 'Grupo eliminado exitosamente',
    'user_added_to_group': 'Usuario agregado al grupo',
    'user_removed_from_group': 'Usuario removido del grupo',
    
    // Notificaciones
    'notification_not_found': 'Notificación no encontrada',
    'notification_created': 'Notificación creada exitosamente',
    'notification_updated': 'Notificación actualizada exitosamente',
    'notification_deleted': 'Notificación eliminada exitosamente',
    'notification_marked_read': 'Notificación marcada como leída',
    'all_notifications_marked_read': 'Todas las notificaciones marcadas como leídas',
    
    // Validación
    'validation_error': 'Error de validación',
    'required_field': 'Campo requerido',
    'invalid_email': 'Correo electrónico inválido',
    'invalid_cpf': 'CPF inválido',
    'invalid_phone': 'Número de teléfono inválido',
    'password_too_short': 'Contraseña muy corta',
    'password_mismatch': 'Las contraseñas no coinciden',
    
    // Permisos
    'permission_denied': 'Permiso denegado',
    'insufficient_permissions': 'Permisos insuficientes',
    'admin_required': 'Acceso de administrador requerido',
    'owner_required': 'Acceso de propietario requerido',
    
    // Errores generales
    'server_error': 'Error interno del servidor',
    'network_error': 'Error de conexión',
    'timeout_error': 'Tiempo límite excedido',
    'not_found': 'Recurso no encontrado',
    'method_not_allowed': 'Método no permitido',
    'bad_request': 'Solicitud inválida',
    'conflict': 'Conflicto de datos',
    'too_many_requests': 'Demasiadas solicitudes',
    
    // Éxito
    'operation_success': 'Operación completada exitosamente',
    'data_saved': 'Datos guardados exitosamente',
    'data_updated': 'Datos actualizados exitosamente',
    'data_deleted': 'Datos eliminados exitosamente',
    'changes_saved': 'Cambios guardados exitosamente'
  }
}

/**
 * Obtém mensagem de API por idioma e chave
 * @param {string} key - Chave da mensagem
 * @param {string} language - Idioma (pt-BR, en, es)
 * @param {Object} variables - Variáveis para substituição
 * @returns {string} Mensagem traduzida
 */
export const getApiMessage = (key, language = 'pt-BR', variables = {}) => {
  const message = apiMessages[language]?.[key] || apiMessages['pt-BR'][key] || key
  
  if (variables && Object.keys(variables).length > 0) {
    return message.replace(/\{(\w+)\}/g, (match, variable) => {
      return variables[variable] || match
    })
  }
  
  return message
}

/**
 * Hook para usar mensagens de API
 * @param {string} language - Idioma
 * @returns {Object} Funções de tradução
 */
export const useApiMessages = (language = 'pt-BR') => {
  return {
    t: (key, variables) => getApiMessage(key, language, variables),
    getLanguage: () => language,
    setLanguage: (newLanguage) => {
      language = newLanguage
    }
  }
}

/**
 * Resposta padronizada de API
 * @param {string} key - Chave da mensagem
 * @param {string} language - Idioma
 * @param {Object} variables - Variáveis para substituição
 * @param {boolean} success - Se a operação foi bem-sucedida
 * @param {any} data - Dados adicionais
 * @returns {Object} Resposta padronizada
 */
export const createApiResponse = (key, language = 'pt-BR', variables = {}, success = true, data = null) => {
  return {
    success,
    message: getApiMessage(key, language, variables),
    data,
    timestamp: new Date().toISOString()
  }
} 
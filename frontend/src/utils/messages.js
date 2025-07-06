/**
 * @fileoverview Sistema de mensagens centralizado para frontend
 * @directory src/utils
 * @description Mensagens centralizadas para internacionalização no frontend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

export const Language = {
  PT_BR: 'pt-BR',
  EN: 'en',
  ES: 'es'
}

export const MessageCategory = {
  TASKS: 'tasks',
  AUTH: 'auth',
  COMMON: 'common',
  ERRORS: 'errors',
  SUCCESS: 'success',
  UI: 'ui'
}

// Mensagens centralizadas por idioma e categoria
const MESSAGES = {
  [Language.PT_BR]: {
    [MessageCategory.TASKS]: {
      'created': 'Tarefa criada com sucesso',
      'updated': 'Tarefa atualizada com sucesso',
      'deleted': 'Tarefa removida com sucesso',
      'status_updated': 'Status da tarefa alterado',
      'loading': 'Carregando tarefas...',
      'error_loading': 'Erro ao carregar tarefas',
      'error_creating': 'Erro ao criar tarefa',
      'error_updating': 'Erro ao atualizar tarefa',
      'error_deleting': 'Erro ao remover tarefa',
      'no_tasks': 'Nenhuma tarefa encontrada',
      'filter_applied': 'Filtro aplicado',
      'filter_cleared': 'Filtro removido'
    },
    [MessageCategory.AUTH]: {
      'login_success': 'Login realizado com sucesso',
      'login_failed': 'Credenciais inválidas',
      'logout_success': 'Logout realizado com sucesso',
      'session_expired': 'Sessão expirada',
      'unauthorized': 'Não autorizado'
    },
    [MessageCategory.COMMON]: {
      'loading': 'Carregando...',
      'error': 'Erro',
      'success': 'Sucesso',
      'warning': 'Atenção',
      'info': 'Informação',
      'confirm': 'Confirmar',
      'cancel': 'Cancelar',
      'save': 'Salvar',
      'edit': 'Editar',
      'delete': 'Excluir',
      'create': 'Criar',
      'search': 'Buscar',
      'filter': 'Filtrar',
      'clear': 'Limpar',
      'close': 'Fechar',
      'back': 'Voltar',
      'next': 'Próximo',
      'previous': 'Anterior'
    },
    [MessageCategory.ERRORS]: {
      'validation_error': 'Erro de validação',
      'not_found': 'Recurso não encontrado',
      'permission_denied': 'Permissão negada',
      'server_error': 'Erro interno do servidor',
      'network_error': 'Erro de conexão',
      'timeout': 'Tempo limite excedido',
      'invalid_data': 'Dados inválidos',
      'unknown_error': 'Erro desconhecido'
    },
    [MessageCategory.SUCCESS]: {
      'operation_completed': 'Operação realizada com sucesso',
      'data_saved': 'Dados salvos com sucesso',
      'data_updated': 'Dados atualizados com sucesso',
      'data_deleted': 'Dados removidos com sucesso',
      'changes_saved': 'Alterações salvas'
    },
    [MessageCategory.UI]: {
      'tasks_title': 'Tarefas',
      'new_task': 'Nova Tarefa',
      'edit_task': 'Editar Tarefa',
      'task_details': 'Detalhes da Tarefa',
      'task_status': 'Status da Tarefa',
      'task_priority': 'Prioridade',
      'task_category': 'Categoria',
      'task_responsible': 'Responsável',
      'task_creator': 'Criador',
      'task_deadline': 'Prazo',
      'task_description': 'Descrição',
      'task_tags': 'Tags',
      'high_priority': 'Alta Prioridade',
      'medium_priority': 'Média Prioridade',
      'low_priority': 'Baixa Prioridade',
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'completed': 'Concluída',
      'cancelled': 'Cancelada',
      'overdue': 'Atrasada'
    }
  },
  [Language.EN]: {
    [MessageCategory.TASKS]: {
      'created': 'Task created successfully',
      'updated': 'Task updated successfully',
      'deleted': 'Task deleted successfully',
      'status_updated': 'Task status updated',
      'loading': 'Loading tasks...',
      'error_loading': 'Error loading tasks',
      'error_creating': 'Error creating task',
      'error_updating': 'Error updating task',
      'error_deleting': 'Error deleting task',
      'no_tasks': 'No tasks found',
      'filter_applied': 'Filter applied',
      'filter_cleared': 'Filter cleared'
    },
    [MessageCategory.AUTH]: {
      'login_success': 'Login successful',
      'login_failed': 'Invalid credentials',
      'logout_success': 'Logout successful',
      'session_expired': 'Session expired',
      'unauthorized': 'Unauthorized'
    },
    [MessageCategory.COMMON]: {
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning',
      'info': 'Information',
      'confirm': 'Confirm',
      'cancel': 'Cancel',
      'save': 'Save',
      'edit': 'Edit',
      'delete': 'Delete',
      'create': 'Create',
      'search': 'Search',
      'filter': 'Filter',
      'clear': 'Clear',
      'close': 'Close',
      'back': 'Back',
      'next': 'Next',
      'previous': 'Previous'
    },
    [MessageCategory.ERRORS]: {
      'validation_error': 'Validation error',
      'not_found': 'Resource not found',
      'permission_denied': 'Permission denied',
      'server_error': 'Internal server error',
      'network_error': 'Connection error',
      'timeout': 'Timeout exceeded',
      'invalid_data': 'Invalid data',
      'unknown_error': 'Unknown error'
    },
    [MessageCategory.SUCCESS]: {
      'operation_completed': 'Operation completed successfully',
      'data_saved': 'Data saved successfully',
      'data_updated': 'Data updated successfully',
      'data_deleted': 'Data deleted successfully',
      'changes_saved': 'Changes saved'
    },
    [MessageCategory.UI]: {
      'tasks_title': 'Tasks',
      'new_task': 'New Task',
      'edit_task': 'Edit Task',
      'task_details': 'Task Details',
      'task_status': 'Task Status',
      'task_priority': 'Priority',
      'task_category': 'Category',
      'task_responsible': 'Responsible',
      'task_creator': 'Creator',
      'task_deadline': 'Deadline',
      'task_description': 'Description',
      'task_tags': 'Tags',
      'high_priority': 'High Priority',
      'medium_priority': 'Medium Priority',
      'low_priority': 'Low Priority',
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'overdue': 'Overdue'
    }
  }
};

class MessageService {
  constructor(language = Language.PT_BR) {
    this.language = language;
  }

  getMessage(category, key, variables) {
    const message = MESSAGES[this.language]?.[category]?.[key] || key;
    
    if (variables) {
      return message.replace(/\{(\w+)\}/g, (match, variable) => {
        return variables[variable] || match;
      });
    }
    
    return message;
  }

  setLanguage(language) {
    this.language = language;
  }

  getLanguage() {
    return this.language;
  }
}

// Instância global do serviço de mensagens
const messageService = new MessageService();

// Hook para usar mensagens em componentes React
export const useMessages = () => {
  return {
    t: (key, variables) => messageService.getMessage(MessageCategory.COMMON, key, variables),
    tTask: (key, variables) => messageService.getMessage(MessageCategory.TASKS, key, variables),
    tAuth: (key, variables) => messageService.getMessage(MessageCategory.AUTH, key, variables),
    tError: (key, variables) => messageService.getMessage(MessageCategory.ERRORS, key, variables),
    tSuccess: (key, variables) => messageService.getMessage(MessageCategory.SUCCESS, key, variables),
    tUI: (key, variables) => messageService.getMessage(MessageCategory.UI, key, variables),
    setLanguage: (language) => messageService.setLanguage(language),
    getLanguage: () => messageService.getLanguage()
  };
};

export default messageService; 
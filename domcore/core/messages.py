"""
@fileoverview Sistema de mensagens centralizado
@directory domcore/core
@description Mensagens centralizadas para internacionalização
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from typing import Dict, Any
from enum import Enum

class Language(str, Enum):
    """Idiomas suportados"""
    PT_BR = "pt-BR"
    EN = "en"
    ES = "es"

class MessageCategory(str, Enum):
    """Categorias de mensagens"""
    TASKS = "tasks"
    AUTH = "auth"
    COMMON = "common"
    ERRORS = "errors"
    SUCCESS = "success"

# Mensagens centralizadas por idioma e categoria
MESSAGES: Dict[str, Dict[str, Dict[str, str]]] = {
    Language.PT_BR: {
        MessageCategory.TASKS: {
            "created": "Tarefa criada com sucesso",
            "updated": "Tarefa atualizada com sucesso",
            "deleted": "Tarefa removida com sucesso",
            "status_updated": "Status da tarefa atualizado",
            "not_found": "Tarefa não encontrada",
            "no_permission_create": "Usuário não tem permissão para criar tarefas",
            "no_permission_view": "Usuário não tem permissão para visualizar esta tarefa",
            "no_permission_edit": "Usuário não tem permissão para editar esta tarefa",
            "no_permission_delete": "Usuário não tem permissão para deletar esta tarefa",
            "invalid_status": "Status inválido para tarefa",
            "invalid_priority": "Prioridade inválida",
            "overdue": "Tarefa atrasada",
            "due_today": "Tarefa vence hoje",
            "due_week": "Tarefa vence esta semana"
        },
        MessageCategory.AUTH: {
            "login_success": "Login realizado com sucesso",
            "login_failed": "Credenciais inválidas",
            "logout_success": "Logout realizado com sucesso",
            "token_invalid": "Token de acesso inválido",
            "token_expired": "Token de acesso expirado"
        },
        MessageCategory.COMMON: {
            "loading": "Carregando...",
            "error": "Erro",
            "success": "Sucesso",
            "warning": "Atenção",
            "info": "Informação",
            "confirm": "Confirmar",
            "cancel": "Cancelar",
            "save": "Salvar",
            "edit": "Editar",
            "delete": "Excluir",
            "create": "Criar",
            "search": "Buscar",
            "filter": "Filtrar",
            "clear": "Limpar"
        },
        MessageCategory.ERRORS: {
            "validation_error": "Erro de validação",
            "not_found": "Recurso não encontrado",
            "permission_denied": "Permissão negada",
            "server_error": "Erro interno do servidor",
            "network_error": "Erro de conexão",
            "timeout": "Tempo limite excedido",
            "invalid_data": "Dados inválidos"
        },
        MessageCategory.SUCCESS: {
            "operation_completed": "Operação realizada com sucesso",
            "data_saved": "Dados salvos com sucesso",
            "data_updated": "Dados atualizados com sucesso",
            "data_deleted": "Dados removidos com sucesso"
        }
    },
    Language.EN: {
        MessageCategory.TASKS: {
            "created": "Task created successfully",
            "updated": "Task updated successfully",
            "deleted": "Task deleted successfully",
            "status_updated": "Task status updated",
            "not_found": "Task not found",
            "no_permission_create": "User does not have permission to create tasks",
            "no_permission_view": "User does not have permission to view this task",
            "no_permission_edit": "User does not have permission to edit this task",
            "no_permission_delete": "User does not have permission to delete this task",
            "invalid_status": "Invalid task status",
            "invalid_priority": "Invalid priority",
            "overdue": "Task overdue",
            "due_today": "Task due today",
            "due_week": "Task due this week"
        },
        MessageCategory.AUTH: {
            "login_success": "Login successful",
            "login_failed": "Invalid credentials",
            "logout_success": "Logout successful",
            "token_invalid": "Invalid access token",
            "token_expired": "Access token expired"
        },
        MessageCategory.COMMON: {
            "loading": "Loading...",
            "error": "Error",
            "success": "Success",
            "warning": "Warning",
            "info": "Information",
            "confirm": "Confirm",
            "cancel": "Cancel",
            "save": "Save",
            "edit": "Edit",
            "delete": "Delete",
            "create": "Create",
            "search": "Search",
            "filter": "Filter",
            "clear": "Clear"
        },
        MessageCategory.ERRORS: {
            "validation_error": "Validation error",
            "not_found": "Resource not found",
            "permission_denied": "Permission denied",
            "server_error": "Internal server error",
            "network_error": "Connection error",
            "timeout": "Timeout exceeded",
            "invalid_data": "Invalid data"
        },
        MessageCategory.SUCCESS: {
            "operation_completed": "Operation completed successfully",
            "data_saved": "Data saved successfully",
            "data_updated": "Data updated successfully",
            "data_deleted": "Data deleted successfully"
        }
    }
}

class MessageService:
    """Serviço para gerenciar mensagens centralizadas"""
    
    def __init__(self, language: Language = Language.PT_BR):
        self.language = language
        self.messages = MESSAGES.get(language, MESSAGES[Language.PT_BR])
    
    def get_message(self, category: MessageCategory, key: str, **kwargs) -> str:
        """Obtém mensagem centralizada com substituição de variáveis"""
        message = self.messages.get(category, {}).get(key, key)
        
        # Substituir variáveis no formato {var_name}
        if kwargs:
            for var_name, value in kwargs.items():
                message = message.replace(f"{{{var_name}}}", str(value))
        
        return message
    
    def get_task_message(self, key: str, **kwargs) -> str:
        """Obtém mensagem específica de tarefas"""
        return self.get_message(MessageCategory.TASKS, key, **kwargs)
    
    def get_auth_message(self, key: str, **kwargs) -> str:
        """Obtém mensagem específica de autenticação"""
        return self.get_message(MessageCategory.AUTH, key, **kwargs)
    
    def get_common_message(self, key: str, **kwargs) -> str:
        """Obtém mensagem comum"""
        return self.get_message(MessageCategory.COMMON, key, **kwargs)
    
    def get_error_message(self, key: str, **kwargs) -> str:
        """Obtém mensagem de erro"""
        return self.get_message(MessageCategory.ERRORS, key, **kwargs)
    
    def get_success_message(self, key: str, **kwargs) -> str:
        """Obtém mensagem de sucesso"""
        return self.get_message(MessageCategory.SUCCESS, key, **kwargs)

# Instância global para uso no sistema
message_service = MessageService() 
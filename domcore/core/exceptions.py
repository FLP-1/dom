"""
Exceções do DOM v1 - Tratamento de erros customizado

@fileoverview Exceções do sistema DOM v1
@directory dom_v1/core
@description Exceções específicas para diferentes tipos de erro
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""


class DOMException(Exception):
    """Exceção base do sistema DOM v1"""
    
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(DOMException):
    """Erro de validação de dados"""
    
    def __init__(self, message: str, field: str = None, value: str = None):
        super().__init__(message, "VALIDATION_ERROR", {"field": field, "value": value})


class AuthenticationError(DOMException):
    """Erro de autenticação"""
    
    def __init__(self, message: str = "Credenciais inválidas"):
        super().__init__(message, "AUTHENTICATION_ERROR")


class AuthorizationError(DOMException):
    """Erro de autorização/permissão"""
    
    def __init__(self, message: str = "Acesso negado", required_permission: str = None):
        super().__init__(message, "AUTHORIZATION_ERROR", {"required_permission": required_permission})


class CPFError(DOMException):
    """Erro relacionado ao CPF"""
    
    def __init__(self, message: str, cpf: str = None):
        super().__init__(message, "CPF_ERROR", {"cpf": cpf})


class ReceitaFederalError(DOMException):
    """Erro na consulta à Receita Federal"""
    
    def __init__(self, message: str, cpf: str = None, status_code: int = None):
        super().__init__(message, "RECEITA_FEDERAL_ERROR", {
            "cpf": cpf, 
            "status_code": status_code
        })


class UserProfileError(DOMException):
    """Erro relacionado ao perfil do usuário"""
    
    def __init__(self, message: str, profile: str = None):
        super().__init__(message, "USER_PROFILE_ERROR", {"profile": profile})


class DatabaseError(DOMException):
    """Erro de banco de dados"""
    
    def __init__(self, message: str, operation: str = None):
        super().__init__(message, "DATABASE_ERROR", {"operation": operation})


class NotificationError(DOMException):
    """Erro no envio de notificações"""
    
    def __init__(self, message: str, notification_type: str = None):
        super().__init__(message, "NOTIFICATION_ERROR", {"notification_type": notification_type})


class TaskError(DOMException):
    """Erro relacionado às tarefas"""
    
    def __init__(self, message: str, task_id: str = None):
        super().__init__(message, "TASK_ERROR", {"task_id": task_id})


class ConfigurationError(DOMException):
    """Erro de configuração"""
    
    def __init__(self, message: str, config_key: str = None):
        super().__init__(message, "CONFIGURATION_ERROR", {"config_key": config_key}) 

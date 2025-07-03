"""
Enums do DOM v1 - Definições de tipos enumerados

@fileoverview Enums do sistema DOM v1
@directory dom_v1/core
@description Definições de perfis de usuário, status e tipos
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from enum import Enum
from typing import Dict, Any


class UserProfile(str, Enum):
    """Perfis de usuário do sistema DOM v1"""
    
    EMPREGADOR = "empregador"
    EMPREGADO = "empregado" 
    FAMILIAR = "familiar"
    PARCEIRO = "parceiro"
    SUBORDINADO = "subordinado"
    ADMIN = "admin"
    OWNER = "owner"
    
    @classmethod
    def get_theme_config(cls, profile: 'UserProfile') -> Dict[str, Any]:
        """Retorna configuração de tema para o perfil"""
        themes = {
            cls.EMPREGADOR: {
                "primary_color": "#2E7D32",
                "text_size": "14px",
                "spacing": "compact",
                "animations": "subtle"
            },
            cls.EMPREGADO: {
                "primary_color": "#FF6B35", 
                "text_size": "16px",
                "spacing": "generous",
                "animations": "none"
            },
            cls.FAMILIAR: {
                "primary_color": "#9C27B0",
                "text_size": "adaptive",
                "spacing": "medium",
                "animations": "gentle"
            },
            cls.PARCEIRO: {
                "primary_color": "#1565C0",
                "secondary_color": "#424242",
                "text_size": "14px", 
                "spacing": "compact",
                "animations": "professional"
            },
            cls.SUBORDINADO: {
                "primary_color": "#388E3C",
                "secondary_color": "#FFA000",
                "text_size": "14px",
                "spacing": "compact", 
                "animations": "efficient"
            },
            cls.ADMIN: {
                "primary_color": "#D32F2F",
                "text_size": "12px",
                "spacing": "dense",
                "animations": "none"
            },
            cls.OWNER: {
                "primary_color": "#000000",
                "secondary_color": "#FFD700",
                "text_size": "14px",
                "spacing": "premium",
                "animations": "elegant"
            }
        }
        return themes.get(profile, themes[cls.EMPREGADOR])


class TaskStatus(str, Enum):
    """Status das tarefas"""
    
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    OVERDUE = "overdue"


class NotificationType(str, Enum):
    """Tipos de notificação"""
    
    TASK_CREATED = "task_created"
    TASK_COMPLETED = "task_completed"
    TASK_OVERDUE = "task_overdue"
    PAYMENT_DUE = "payment_due"
    PAYMENT_RECEIVED = "payment_received"
    SYSTEM_ALERT = "system_alert"
    FAMILY_SHARE = "family_share"


class PermissionLevel(str, Enum):
    """Níveis de permissão"""
    
    READ = "read"
    WRITE = "write"
    ADMIN = "admin"
    OWNER = "owner"


class Platform(str, Enum):
    """Plataformas suportadas"""
    
    WEB = "web"
    IOS = "ios"
    ANDROID = "android"
    DESKTOP = "desktop" 

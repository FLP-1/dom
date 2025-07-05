"""
Modelos do DOM v1 - Entidades do sistema

@fileoverview Modelos do sistema DOM v1
@directory dom_v1/models
@description Entidades e modelos de dados do sistema
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from .user import User, UserCreate, UserUpdate, UserProfileInfo, UserDB, UserSession, UserGroupRole
from .task import Task, TaskCreate, TaskUpdate
from .notification import Notification, NotificationCreate
from .group import Group, GroupCreate, GroupUpdate, GroupResponse

# Configurar relacionamentos após importar todos os modelos
from .relationships import configure_relationships
configure_relationships()

# Exportar Base para criação de tabelas
from ..core.db import Base

__all__ = [
    "User",
    "UserCreate", 
    "UserUpdate",
    "UserProfileInfo",
    "UserDB",
    "UserSession",
    "UserGroupRole",
    "Task",
    "TaskCreate",
    "TaskUpdate",
    "Notification",
    "NotificationCreate",
    "Group",
    "GroupCreate",
    "GroupUpdate",
    "GroupResponse",
    "Base"
] 

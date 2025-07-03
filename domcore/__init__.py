"""
DOM v1 - Sistema de Gestão Doméstica
Sistema multiplataforma para gestão de empregados domésticos

@fileoverview Pacote principal do DOM v1
@directory dom_v1
@description Sistema completo de gestão doméstica com perfis adaptativos
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

__version__ = "1.0.0"
__author__ = "Equipe DOM v1"
__description__ = "Sistema de Gestão Doméstica"

from .core import *
from .models import *
from .services import *
from .utils import *

__all__ = [
    "UserProfile",
    "CPFValidator", 
    "ReceitaFederalService",
    "UserService",
    "TaskService",
    "NotificationService"
] 

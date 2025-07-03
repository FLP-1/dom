"""
Core do DOM v1 - Definições principais

@fileoverview Módulo core do DOM v1
@directory dom_v1/core
@description Definições de tipos, enums e configurações principais
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from .enums import *
from .config import *
from .exceptions import *

__all__ = [
    "UserProfile",
    "TaskStatus", 
    "NotificationType",
    "DOMConfig",
    "DOMException"
] 

"""
Serviços do DOM v1

@fileoverview Inicialização dos serviços
@directory domcore/services
@description Módulo de serviços do sistema DOM v1
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from .dashboard_service import DashboardService
from .task_service import TaskService

__all__ = ['DashboardService', 'TaskService'] 
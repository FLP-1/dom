"""
Utilitários do DOM v1 - Funções auxiliares

@fileoverview Módulo de utilitários do DOM v1
@directory dom_v1/utils
@description Funções auxiliares e utilitários do sistema
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from .cpf_validator import CPFValidator
from .receita_federal import ReceitaFederalService

__all__ = [
    "CPFValidator",
    "ReceitaFederalService"
] 

"""
Validador de CPF - Validação e formatação de CPF

@fileoverview Validador de CPF do DOM v1
@directory dom_v1/utils
@description Validação completa de CPF com dígito verificador
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import re
import random
from typing import Optional, Tuple
from ..core.exceptions import CPFError


class CPFValidator:
    """Validador de CPF com dígito verificador"""
    
    @staticmethod
    def clean_cpf(cpf: str) -> str:
        """
        Remove caracteres não numéricos do CPF
        
        Args:
            cpf: CPF com ou sem formatação
            
        Returns:
            CPF apenas com números
        """
        return re.sub(r'[^\d]', '', cpf)
    
    @staticmethod
    def format_cpf(cpf: str) -> str:
        """
        Formata CPF no padrão XXX.XXX.XXX-XX
        
        Args:
            cpf: CPF limpo (apenas números)
            
        Returns:
            CPF formatado
            
        Raises:
            CPFError: Se o CPF não tiver 11 dígitos
        """
        clean = CPFValidator.clean_cpf(cpf)
        
        if len(clean) != 11:
            raise CPFError(f"CPF deve ter 11 dígitos, recebido: {len(clean)}", cpf)
        
        return f"{clean[:3]}.{clean[3:6]}.{clean[6:9]}-{clean[9:]}"
    
    @staticmethod
    def calculate_digit(cpf_digits: str, position: int) -> int:
        """
        Calcula dígito verificador do CPF
        
        Args:
            cpf_digits: Primeiros 9 ou 10 dígitos do CPF
            position: Posição do dígito (1 ou 2)
            
        Returns:
            Dígito verificador calculado
        """
        if position not in [1, 2]:
            raise ValueError("Posição deve ser 1 ou 2")
        
        # Multiplicadores para cada posição
        multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2] if position == 1 else [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
        
        # Calcula soma ponderada
        total = sum(int(cpf_digits[i]) * multipliers[i] for i in range(len(cpf_digits)))
        
        # Calcula resto
        remainder = total % 11
        
        # Retorna dígito verificador
        return 0 if remainder < 2 else 11 - remainder
    
    @staticmethod
    def validate_cpf(cpf: str) -> bool:
        """
        Valida CPF completo com dígitos verificadores
        
        Args:
            cpf: CPF a ser validado
            
        Returns:
            True se CPF é válido, False caso contrário
        """
        try:
            # Limpa CPF
            clean = CPFValidator.clean_cpf(cpf)
            
            # Verifica se tem 11 dígitos
            if len(clean) != 11:
                return False
            
            # Verifica se todos os dígitos são iguais (CPF inválido)
            if len(set(clean)) == 1:
                return False
            
            # Calcula primeiro dígito verificador
            first_digit = CPFValidator.calculate_digit(clean[:9], 1)
            
            # Verifica primeiro dígito
            if int(clean[9]) != first_digit:
                return False
            
            # Calcula segundo dígito verificador
            second_digit = CPFValidator.calculate_digit(clean[:10], 2)
            
            # Verifica segundo dígito
            if int(clean[10]) != second_digit:
                return False
            
            return True
            
        except (ValueError, IndexError):
            return False
    
    @staticmethod
    def generate_valid_cpf() -> str:
        """
        Gera um CPF válido para testes
        
        Returns:
            CPF válido formatado
        """
        # Gera 9 dígitos aleatórios
        digits = [random.randint(0, 9) for _ in range(9)]
        
        # Calcula primeiro dígito verificador
        first_digit = CPFValidator.calculate_digit(''.join(map(str, digits)), 1)
        digits.append(first_digit)
        
        # Calcula segundo dígito verificador
        second_digit = CPFValidator.calculate_digit(''.join(map(str, digits)), 2)
        digits.append(second_digit)
        
        # Formata CPF
        return CPFValidator.format_cpf(''.join(map(str, digits)))
    
    @staticmethod
    def extract_info(cpf: str) -> dict:
        """
        Extrai informações do CPF
        
        Args:
            cpf: CPF válido
            
        Returns:
            Dicionário com informações do CPF
            
        Raises:
            CPFError: Se CPF for inválido
        """
        if not CPFValidator.validate_cpf(cpf):
            raise CPFError("CPF inválido", cpf)
        
        clean = CPFValidator.clean_cpf(cpf)
        
        return {
            "cpf": CPFValidator.format_cpf(clean),
            "cpf_clean": clean,
            "region": CPFValidator._get_region(clean[:2]),
            "is_valid": True
        }
    
    @staticmethod
    def _get_region(first_digits: str) -> str:
        """
        Retorna a região fiscal baseada nos primeiros dígitos
        
        Args:
            first_digits: Primeiros dois dígitos do CPF
            
        Returns:
            Nome da região fiscal
        """
        regions = {
            "01": "Distrito Federal, Goiás, Mato Grosso do Sul e Tocantins",
            "02": "Pará, Amazonas, Acre, Amapá, Rondônia e Roraima",
            "03": "Ceará, Maranhão e Piauí",
            "04": "Pernambuco, Rio Grande do Norte, Paraíba e Alagoas",
            "05": "Bahia e Sergipe",
            "06": "Minas Gerais",
            "07": "Rio de Janeiro e Espírito Santo",
            "08": "São Paulo",
            "09": "Paraná e Santa Catarina",
            "10": "Rio Grande do Sul"
        }
        
        return regions.get(first_digits, "Região não identificada") 

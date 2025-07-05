"""
Validador de CPF com dígito verificador
@created 2024-12-19
@author DOM Team
"""
import re
from typing import Tuple

def clean_cpf(cpf: str) -> str:
    """Remove caracteres não numéricos do CPF"""
    return re.sub(r'[^\d]', '', cpf)

def format_cpf(cpf: str) -> str:
    """Formata CPF no padrão 000.000.000-00"""
    cpf_clean = clean_cpf(cpf)
    if len(cpf_clean) != 11:
        raise ValueError("CPF deve ter 11 dígitos")
    return f"{cpf_clean[:3]}.{cpf_clean[3:6]}.{cpf_clean[6:9]}-{cpf_clean[9:]}"

def get_cpf_without_mask(cpf: str) -> str:
    """Retorna CPF sem máscara (apenas números)"""
    return clean_cpf(cpf)

def calculate_digit(cpf_partial: str) -> int:
    """Calcula dígito verificador do CPF"""
    if len(cpf_partial) != 9:
        raise ValueError("CPF parcial deve ter 9 dígitos")
    
    # Primeiro dígito
    sum1 = sum(int(cpf_partial[i]) * (10 - i) for i in range(9))
    digit1 = (sum1 * 10) % 11
    if digit1 == 10:
        digit1 = 0
    
    # Segundo dígito
    cpf_with_digit1 = cpf_partial + str(digit1)
    sum2 = sum(int(cpf_with_digit1[i]) * (11 - i) for i in range(10))
    digit2 = (sum2 * 10) % 11
    if digit2 == 10:
        digit2 = 0
    
    return digit1 * 10 + digit2

def validate_cpf(cpf: str) -> bool:
    """Valida CPF completo com dígitos verificadores"""
    cpf_clean = clean_cpf(cpf)
    
    if len(cpf_clean) != 11:
        return False
    
    # Verifica se todos os dígitos são iguais
    if len(set(cpf_clean)) == 1:
        return False
    
    # Calcula dígitos verificadores
    expected_digits = calculate_digit(cpf_clean[:9])
    actual_digits = int(cpf_clean[9:])
    
    return expected_digits == actual_digits

def generate_valid_cpf() -> str:
    """Gera um CPF válido aleatório formatado"""
    import random
    
    # Gera 9 dígitos aleatórios
    cpf_partial = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    
    # Calcula dígitos verificadores
    digits = calculate_digit(cpf_partial)
    
    # Formata CPF
    cpf_complete = cpf_partial + str(digits).zfill(2)
    return format_cpf(cpf_complete)

def generate_valid_cpf_raw() -> str:
    """Gera um CPF válido aleatório sem máscara (11 dígitos)"""
    import random
    
    # Gera 9 dígitos aleatórios
    cpf_partial = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    
    # Calcula dígitos verificadores
    digits = calculate_digit(cpf_partial)
    
    # Retorna CPF sem máscara
    cpf_complete = cpf_partial + str(digits).zfill(2)
    return cpf_complete 
"""
Configurações do DOM v1 - Configurações do sistema

@fileoverview Configurações do sistema DOM v1
@directory dom_v1/core
@description Configurações centralizadas do sistema
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import os
from typing import Dict, Any, Optional
from dataclasses import dataclass
from .exceptions import ConfigurationError


@dataclass
class DatabaseConfig:
    """Configurações do banco de dados"""
    
    host: str = "localhost"
    port: int = 5432
    database: str = "db_dom"
    username: str = "postgres"
    password: str = "FLP*2025"
    pool_size: int = 10
    max_overflow: int = 20
    
    @classmethod
    def from_env(cls) -> 'DatabaseConfig':
        """Cria configuração a partir de variáveis de ambiente"""
        return cls(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "5432")),
            database=os.getenv("DB_NAME", "db_dom"),
            username=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "FLP*2025"),
            pool_size=int(os.getenv("DB_POOL_SIZE", "10")),
            max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "20"))
        )


@dataclass
class SecurityConfig:
    """Configurações de segurança"""
    
    secret_key: str = "dom-v1-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    bcrypt_rounds: int = 12
    
    @classmethod
    def from_env(cls) -> 'SecurityConfig':
        """Cria configuração a partir de variáveis de ambiente"""
        return cls(
            secret_key=os.getenv("SECRET_KEY", "dom-v1-secret-key-change-in-production"),
            algorithm=os.getenv("ALGORITHM", "HS256"),
            access_token_expire_minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")),
            refresh_token_expire_days=int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7")),
            bcrypt_rounds=int(os.getenv("BCRYPT_ROUNDS", "12"))
        )


@dataclass
class ReceitaFederalConfig:
    """Configurações da Receita Federal"""
    
    api_url: str = "https://api.receita.fazenda.gov.br"
    timeout: int = 30
    max_retries: int = 3
    retry_delay: int = 1
    
    @classmethod
    def from_env(cls) -> 'ReceitaFederalConfig':
        """Cria configuração a partir de variáveis de ambiente"""
        return cls(
            api_url=os.getenv("RECEITA_API_URL", "https://api.receita.fazenda.gov.br"),
            timeout=int(os.getenv("RECEITA_TIMEOUT", "30")),
            max_retries=int(os.getenv("RECEITA_MAX_RETRIES", "3")),
            retry_delay=int(os.getenv("RECEITA_RETRY_DELAY", "1"))
        )


@dataclass
class NotificationConfig:
    """Configurações de notificações"""
    
    email_enabled: bool = True
    sms_enabled: bool = True
    push_enabled: bool = True
    whatsapp_enabled: bool = True
    
    @classmethod
    def from_env(cls) -> 'NotificationConfig':
        """Cria configuração a partir de variáveis de ambiente"""
        return cls(
            email_enabled=os.getenv("EMAIL_ENABLED", "true").lower() == "true",
            sms_enabled=os.getenv("SMS_ENABLED", "true").lower() == "true",
            push_enabled=os.getenv("PUSH_ENABLED", "true").lower() == "true",
            whatsapp_enabled=os.getenv("WHATSAPP_ENABLED", "true").lower() == "true"
        )


@dataclass
class DOMConfig:
    """Configuração principal do sistema DOM v1"""
    
    debug: bool = False
    environment: str = "development"
    database: DatabaseConfig = None
    security: SecurityConfig = None
    receita_federal: ReceitaFederalConfig = None
    notifications: NotificationConfig = None
    
    def __post_init__(self):
        """Inicializa configurações padrão se não fornecidas"""
        if self.database is None:
            self.database = DatabaseConfig.from_env()
        if self.security is None:
            self.security = SecurityConfig.from_env()
        if self.receita_federal is None:
            self.receita_federal = ReceitaFederalConfig.from_env()
        if self.notifications is None:
            self.notifications = NotificationConfig.from_env()
    
    @classmethod
    def from_env(cls) -> 'DOMConfig':
        """Cria configuração completa a partir de variáveis de ambiente"""
        return cls(
            debug=os.getenv("DEBUG", "false").lower() == "true",
            environment=os.getenv("ENVIRONMENT", "development"),
            database=DatabaseConfig.from_env(),
            security=SecurityConfig.from_env(),
            receita_federal=ReceitaFederalConfig.from_env(),
            notifications=NotificationConfig.from_env()
        )
    
    def validate(self) -> None:
        """Valida a configuração"""
        if not self.security.secret_key or self.security.secret_key == "dom-v1-secret-key-change-in-production":
            if self.environment == "production":
                raise ConfigurationError(
                    "SECRET_KEY deve ser definida em produção",
                    "SECRET_KEY"
                )
        
        if not self.database.password and self.environment == "production":
            raise ConfigurationError(
                "DB_PASSWORD deve ser definida em produção",
                "DB_PASSWORD"
            )


# Instância global da configuração
config = DOMConfig.from_env() 

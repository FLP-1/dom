"""
Modelo de Usuário - Entidade principal do sistema

@fileoverview Modelo de usuário do DOM v1
@directory dom_v1/models
@description Definição da entidade usuário com Pydantic e SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field, validator
from ..core.enums import UserProfile, Platform
from ..utils.cpf_validator import CPFValidator
from ..core.db import Base

# Modelos SQLAlchemy para tabelas
class UserDB(Base):
    """Tabela de usuários no banco de dados"""
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True, index=True)
    cpf = Column(String(14), unique=True, index=True, nullable=False)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    telefone = Column(String(20), nullable=True)
    perfil = Column(String(20), nullable=False, default="empregador")
    senha_hash = Column(String(255), nullable=False)
    ativo = Column(Boolean, default=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ultimo_login = Column(DateTime, nullable=True)
    plataformas = Column(JSON, default=list)
    permissoes = Column(JSON, default=list)

class UserSessionDB(Base):
    """Tabela de sessões de usuário"""
    __tablename__ = "user_sessions"
    
    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), nullable=False, index=True)
    token = Column(String(500), unique=True, nullable=False)
    refresh_token = Column(String(500), unique=True, nullable=False)
    expira_em = Column(DateTime, nullable=False)
    plataforma = Column(String(20), nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    ativo = Column(Boolean, default=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)

class UserBase(BaseModel):
    """Modelo base para usuário"""
    
    cpf: str = Field(..., description="CPF do usuário")
    nome: str = Field(..., min_length=2, max_length=100, description="Nome completo")
    email: str = Field(..., description="Email do usuário")
    telefone: Optional[str] = Field(None, description="Telefone do usuário")
    perfil: UserProfile = Field(..., description="Perfil do usuário")
    
    @validator('cpf')
    def validate_cpf(cls, v):
        """Valida CPF"""
        if not CPFValidator.validate_cpf(v):
            raise ValueError('CPF inválido')
        return CPFValidator.format_cpf(v)
    
    @validator('email')
    def validate_email(cls, v):
        """Valida formato de email"""
        if '@' not in v or '.' not in v:
            raise ValueError('Email inválido')
        return v.lower()


class UserCreate(UserBase):
    """Modelo para criação de usuário"""
    
    senha: str = Field(..., min_length=6, description="Senha do usuário")
    confirmar_senha: str = Field(..., description="Confirmação da senha")
    
    @validator('confirmar_senha')
    def validate_password_confirmation(cls, v, values):
        """Valida confirmação de senha"""
        if 'senha' in values and v != values['senha']:
            raise ValueError('Senhas não coincidem')
        return v


class UserUpdate(BaseModel):
    """Modelo para atualização de usuário"""
    
    nome: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = Field(None)
    telefone: Optional[str] = Field(None)
    perfil: Optional[UserProfile] = Field(None)
    ativo: Optional[bool] = Field(None)
    
    @validator('email')
    def validate_email(cls, v):
        """Valida formato de email"""
        if v is not None and ('@' not in v or '.' not in v):
            raise ValueError('Email inválido')
        return v.lower() if v else v


class User(UserBase):
    """Modelo completo de usuário"""
    
    id: str = Field(..., description="ID único do usuário")
    ativo: bool = Field(True, description="Status ativo do usuário")
    data_criacao: datetime = Field(..., description="Data de criação")
    data_atualizacao: datetime = Field(..., description="Data da última atualização")
    ultimo_login: Optional[datetime] = Field(None, description="Data do último login")
    plataformas: List[Platform] = Field(default_factory=list, description="Plataformas utilizadas")
    permissoes: List[str] = Field(default_factory=list, description="Permissões do usuário")
    
    class Config:
        """Configuração do modelo"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "user_123",
                "cpf": "123.456.789-01",
                "nome": "Maria Silva Santos",
                "email": "maria@exemplo.com",
                "telefone": "(11) 99999-9999",
                "perfil": "empregador",
                "ativo": True,
                "data_criacao": "2024-12-19T10:00:00",
                "data_atualizacao": "2024-12-19T10:00:00",
                "plataformas": ["web", "ios"],
                "permissoes": ["read", "write"]
            }
        }


class UserLogin(BaseModel):
    """Modelo para login de usuário"""
    
    cpf: str = Field(..., description="CPF do usuário")
    senha: str = Field(..., description="Senha do usuário")
    plataforma: Platform = Field(..., description="Plataforma de login")
    
    @validator('cpf')
    def validate_cpf(cls, v):
        """Valida CPF"""
        if not CPFValidator.validate_cpf(v):
            raise ValueError('CPF inválido')
        return CPFValidator.format_cpf(v)


class UserSession(BaseModel):
    """Modelo para sessão do usuário"""
    
    user_id: str = Field(..., description="ID do usuário")
    token: str = Field(..., description="Token de acesso")
    refresh_token: str = Field(..., description="Token de renovação")
    expira_em: datetime = Field(..., description="Data de expiração")
    plataforma: Platform = Field(..., description="Plataforma da sessão")
    ip_address: Optional[str] = Field(None, description="Endereço IP")
    user_agent: Optional[str] = Field(None, description="User Agent")
    
    class Config:
        """Configuração do modelo"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UserProfileInfo(BaseModel):
    """Informações do perfil do usuário"""
    
    perfil: UserProfile = Field(..., description="Perfil do usuário")
    tema: dict = Field(..., description="Configuração de tema")
    permissoes: List[str] = Field(..., description="Permissões disponíveis")
    funcionalidades: List[str] = Field(..., description="Funcionalidades disponíveis")
    
    @classmethod
    def from_profile(cls, profile: UserProfile) -> 'UserProfileInfo':
        """Cria informações do perfil baseado no tipo"""
        tema = UserProfile.get_theme_config(profile)
        
        # Permissões por perfil
        permissoes_map = {
            UserProfile.EMPREGADOR: ["read", "write", "manage_tasks", "view_reports"],
            UserProfile.EMPREGADO: ["read", "update_tasks", "view_schedule"],
            UserProfile.FAMILIAR: ["read", "view_family"],
            UserProfile.PARCEIRO: ["read", "write", "admin", "view_metrics"],
            UserProfile.SUBORDINADO: ["read", "write", "operational"],
            UserProfile.ADMIN: ["read", "write", "admin", "system"],
            UserProfile.OWNER: ["read", "write", "admin", "owner", "system"]
        }
        
        # Funcionalidades por perfil
        funcionalidades_map = {
            UserProfile.EMPREGADOR: ["dashboard", "tasks", "employees", "reports", "payments"],
            UserProfile.EMPREGADO: ["tasks", "schedule", "profile", "notifications"],
            UserProfile.FAMILIAR: ["family_view", "notifications", "profile"],
            UserProfile.PARCEIRO: ["dashboard", "metrics", "partners", "reports", "white_label"],
            UserProfile.SUBORDINADO: ["operations", "reports", "tasks", "users"],
            UserProfile.ADMIN: ["admin_panel", "logs", "config", "users", "system"],
            UserProfile.OWNER: ["executive_dashboard", "analytics", "system", "code_access"]
        }
        
        return cls(
            perfil=profile,
            tema=tema,
            permissoes=permissoes_map.get(profile, []),
            funcionalidades=funcionalidades_map.get(profile, [])
        ) 

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
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, LargeBinary, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field, validator
from ..core.enums import UserProfile, Platform
from ..utils.cpf_validator import CPFValidator
from ..core.db import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy import func

# Modelos SQLAlchemy para tabelas
class UserDB(Base):
    """Tabela de usuários no banco de dados"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cpf = Column(String(11), unique=True, index=True, nullable=False)
    nome = Column(String(100), nullable=False)
    nickname = Column(String(20), nullable=True, comment="Nome curto/apelido do usuário")
    email = Column(String(100), index=True, nullable=False)
    celular = Column(String(20), nullable=True)
    perfil = Column(String(20), nullable=False, default="empregador")
    senha_hash = Column(String(255), nullable=False)
    ativo = Column(Boolean, default=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ultimo_login = Column(DateTime, nullable=True)
    plataformas = Column(JSON, default=list)
    permissoes = Column(JSON, default=list)
    user_photo = Column(LargeBinary, nullable=True, comment="Foto do usuário (binário)")

class UserSession(Base):
    __tablename__ = 'user_sessions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    session_token = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    expires_at = Column(DateTime)
    active_context_group_id = Column(UUID(as_uuid=True), ForeignKey('groups.id'))
    active_context_role = Column(String)
    user_agent = Column(String)
    ip_address = Column(String)

class UserGroupRole(Base):
    """Tabela de papéis dos usuários nos grupos (contextos)"""
    __tablename__ = 'user_group_roles'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    group_id = Column(UUID(as_uuid=True), ForeignKey('groups.id'), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class UserBase(BaseModel):
    """Modelo base para usuário"""
    
    cpf: str = Field(..., description="CPF do usuário")
    nome: str = Field(..., min_length=2, max_length=100, description="Nome completo")
    nickname: Optional[str] = Field(None, max_length=50, description="Nome curto/apelido do usuário")
    email: str = Field(..., description="Email do usuário")
    celular: Optional[str] = Field(None, description="Celular do usuário")
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
    nickname: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None)
    celular: Optional[str] = Field(None)
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
                "nickname": "Maria",
                "email": "maria@exemplo.com",
                "celular": "(11) 99999-9999",
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

# Nota: Os relacionamentos SQLAlchemy serão configurados após a importação de todos os modelos
# para evitar importações circulares. Ver arquivo de configuração de relacionamentos. 
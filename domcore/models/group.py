"""
Modelo de Grupo para DOM v1
@fileoverview Modelo de Grupo
@directory domcore/models
@description Modelo para grupos/núcleos do sistema
@created 2024-12-19
@author DOM Team
"""

from sqlalchemy import Column, String, DateTime, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid
from ..core.db import Base

class Group(Base):
    """Tabela de grupos no banco de dados"""
    __tablename__ = "groups"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(255), nullable=False)
    descricao = Column(String(500), nullable=True)
    tipo = Column(String(50), nullable=False, default="familia")
    ativo = Column(Boolean, default=True)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relacionamentos
    usuarios = relationship("UserGroupRole", back_populates="grupo")
    
    def to_dict(self):
        """Converte o grupo para dicionário"""
        return {
            "id": str(self.id),
            "nome": self.nome,
            "descricao": self.descricao,
            "tipo": self.tipo,
            "ativo": self.ativo,
            "data_criacao": self.data_criacao.isoformat() if self.data_criacao else None,
            "data_atualizacao": self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

class GroupCreate(BaseModel):
    """Modelo para criação de grupo"""
    nome: str = Field(..., min_length=1, max_length=255, description="Nome do grupo")
    descricao: Optional[str] = Field(None, max_length=500, description="Descrição do grupo")
    tipo: str = Field("familia", description="Tipo do grupo")

class GroupUpdate(BaseModel):
    """Modelo para atualização de grupo"""
    nome: Optional[str] = Field(None, min_length=1, max_length=255, description="Nome do grupo")
    descricao: Optional[str] = Field(None, max_length=500, description="Descrição do grupo")
    tipo: Optional[str] = Field(None, description="Tipo do grupo")
    ativo: Optional[bool] = Field(None, description="Status ativo do grupo")

class GroupResponse(BaseModel):
    """Modelo de resposta para grupo"""
    id: str = Field(..., description="ID único do grupo")
    nome: str = Field(..., description="Nome do grupo")
    descricao: Optional[str] = Field(None, description="Descrição do grupo")
    tipo: str = Field(..., description="Tipo do grupo")
    ativo: bool = Field(..., description="Status ativo do grupo")
    data_criacao: datetime = Field(..., description="Data de criação")
    data_atualizacao: datetime = Field(..., description="Data da última atualização")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 
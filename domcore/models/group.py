"""
Modelo de Grupo para DOM v1
@fileoverview Modelo de Grupo
@directory domcore/models
@description Modelo para grupos/núcleos do sistema
@created 2024-12-19
@author DOM Team
"""

from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
import uuid
from ..core.db import Base
from typing import Optional

class Group(Base):
    """Tabela de grupos no banco de dados"""
    __tablename__ = "groups"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class GroupCreate(BaseModel):
    """Modelo para criação de grupo"""
    name: str = Field(..., min_length=1, max_length=255, description="Nome do grupo")

class GroupUpdate(BaseModel):
    """Modelo para atualização de grupo"""
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Nome do grupo")

class GroupResponse(BaseModel):
    """Modelo de resposta para grupo"""
    id: str = Field(..., description="ID único do grupo")
    name: str = Field(..., description="Nome do grupo")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data da última atualização")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 
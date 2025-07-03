"""
Modelo de Tarefa - Entidade de tarefas do sistema

@fileoverview Modelo de tarefa do DOM v1
@directory domcore/models
@description Definição da entidade tarefa com Pydantic e SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, ForeignKey, Integer
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, validator
from ..core.enums import TaskStatus
from ..core.db import Base

# Modelos SQLAlchemy para tabelas
class TaskDB(Base):
    """Tabela de tarefas no banco de dados"""
    __tablename__ = "tasks"
    
    id = Column(String(50), primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default=TaskStatus.PENDING)
    prioridade = Column(Integer, default=1)  # 1=baixa, 2=média, 3=alta
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_limite = Column(DateTime, nullable=True)
    data_conclusao = Column(DateTime, nullable=True)
    criador_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    responsavel_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    categoria = Column(String(50), nullable=True)
    tags = Column(JSON, default=list)
    anexos = Column(JSON, default=list)
    comentarios = Column(JSON, default=list)
    ativo = Column(Boolean, default=True)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TaskBase(BaseModel):
    """Modelo base para tarefa"""
    
    titulo: str = Field(..., min_length=1, max_length=200, description="Título da tarefa")
    descricao: Optional[str] = Field(None, description="Descrição detalhada da tarefa")
    prioridade: int = Field(1, ge=1, le=3, description="Prioridade: 1=baixa, 2=média, 3=alta")
    data_limite: Optional[datetime] = Field(None, description="Data limite para conclusão")
    categoria: Optional[str] = Field(None, description="Categoria da tarefa")
    tags: List[str] = Field(default_factory=list, description="Tags da tarefa")

class TaskCreate(TaskBase):
    """Modelo para criação de tarefa"""
    
    responsavel_id: Optional[str] = Field(None, description="ID do responsável pela tarefa")

class TaskUpdate(BaseModel):
    """Modelo para atualização de tarefa"""
    
    titulo: Optional[str] = Field(None, min_length=1, max_length=200)
    descricao: Optional[str] = Field(None)
    status: Optional[TaskStatus] = Field(None)
    prioridade: Optional[int] = Field(None, ge=1, le=3)
    data_limite: Optional[datetime] = Field(None)
    data_conclusao: Optional[datetime] = Field(None)
    responsavel_id: Optional[str] = Field(None)
    categoria: Optional[str] = Field(None)
    tags: Optional[List[str]] = Field(None)
    anexos: Optional[List[str]] = Field(None)
    comentarios: Optional[List[dict]] = Field(None)

class Task(TaskBase):
    """Modelo completo de tarefa"""
    
    id: str = Field(..., description="ID único da tarefa")
    status: TaskStatus = Field(..., description="Status atual da tarefa")
    criador_id: str = Field(..., description="ID do criador da tarefa")
    responsavel_id: Optional[str] = Field(None, description="ID do responsável")
    data_criacao: datetime = Field(..., description="Data de criação")
    data_atualizacao: datetime = Field(..., description="Data da última atualização")
    data_conclusao: Optional[datetime] = Field(None, description="Data de conclusão")
    anexos: List[str] = Field(default_factory=list, description="Lista de anexos")
    comentarios: List[dict] = Field(default_factory=list, description="Comentários da tarefa")
    ativo: bool = Field(True, description="Status ativo da tarefa")
    
    class Config:
        """Configuração do modelo"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "task_123",
                "titulo": "Limpar a casa",
                "descricao": "Limpeza geral da casa incluindo quartos, banheiros e cozinha",
                "status": "pending",
                "prioridade": 2,
                "criador_id": "user_123",
                "responsavel_id": "user_456",
                "data_criacao": "2024-12-19T10:00:00",
                "data_limite": "2024-12-20T18:00:00",
                "categoria": "limpeza",
                "tags": ["casa", "limpeza", "semanal"]
            }
        }

class TaskStats(BaseModel):
    """Estatísticas de tarefas por perfil"""
    
    total_tarefas: int = Field(0, description="Total de tarefas")
    tarefas_pendentes: int = Field(0, description="Tarefas pendentes")
    tarefas_em_andamento: int = Field(0, description="Tarefas em andamento")
    tarefas_concluidas: int = Field(0, description="Tarefas concluídas")
    tarefas_atrasadas: int = Field(0, description="Tarefas atrasadas")
    tarefas_hoje: int = Field(0, description="Tarefas para hoje")
    tarefas_semana: int = Field(0, description="Tarefas da semana")
    
    class Config:
        """Configuração do modelo"""
        schema_extra = {
            "example": {
                "total_tarefas": 15,
                "tarefas_pendentes": 8,
                "tarefas_em_andamento": 3,
                "tarefas_concluidas": 4,
                "tarefas_atrasadas": 1,
                "tarefas_hoje": 2,
                "tarefas_semana": 7
            }
        }

 
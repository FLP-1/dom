"""
Modelo de Notificação - Entidade de notificações do sistema

@fileoverview Modelo de notificação do DOM v1
@directory domcore/models
@description Definição da entidade notificação com Pydantic e SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, ForeignKey
from pydantic import BaseModel, Field, validator
from ..core.enums import NotificationType
from ..core.db import Base

# Modelos SQLAlchemy para tabelas
class NotificationDB(Base):
    """Tabela de notificações no banco de dados"""
    __tablename__ = "notifications"
    
    id = Column(String(50), primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)
    titulo = Column(String(200), nullable=False)
    mensagem = Column(Text, nullable=False)
    destinatario_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    remetente_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    lida = Column(Boolean, default=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_leitura = Column(DateTime, nullable=True)
    dados_extras = Column(JSON, default=dict)
    prioridade = Column(String(20), default="normal")  # baixa, normal, alta, urgente
    categoria = Column(String(50), nullable=True)
    ativo = Column(Boolean, default=True)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NotificationBase(BaseModel):
    """Modelo base para notificação"""
    
    tipo: NotificationType = Field(..., description="Tipo da notificação")
    titulo: str = Field(..., min_length=1, max_length=200, description="Título da notificação")
    mensagem: str = Field(..., description="Mensagem da notificação")
    destinatario_id: str = Field(..., description="ID do destinatário")
    remetente_id: Optional[str] = Field(None, description="ID do remetente")
    prioridade: str = Field("normal", description="Prioridade da notificação")
    categoria: Optional[str] = Field(None, description="Categoria da notificação")
    dados_extras: Dict[str, Any] = Field(default_factory=dict, description="Dados extras da notificação")
    
    @validator('prioridade')
    def validate_priority(cls, v):
        """Valida prioridade"""
        valid_priorities = ['baixa', 'normal', 'alta', 'urgente']
        if v not in valid_priorities:
            raise ValueError(f'Prioridade deve ser uma das: {valid_priorities}')
        return v

class NotificationCreate(NotificationBase):
    """Modelo para criação de notificação"""
    pass

class NotificationUpdate(BaseModel):
    """Modelo para atualização de notificação"""
    
    titulo: Optional[str] = Field(None, min_length=1, max_length=200)
    mensagem: Optional[str] = Field(None)
    lida: Optional[bool] = Field(None)
    prioridade: Optional[str] = Field(None)
    categoria: Optional[str] = Field(None)
    dados_extras: Optional[Dict[str, Any]] = Field(None)
    ativo: Optional[bool] = Field(None)

class Notification(NotificationBase):
    """Modelo completo de notificação"""
    
    id: str = Field(..., description="ID único da notificação")
    lida: bool = Field(False, description="Status de leitura")
    data_criacao: datetime = Field(..., description="Data de criação")
    data_atualizacao: datetime = Field(..., description="Data da última atualização")
    data_leitura: Optional[datetime] = Field(None, description="Data de leitura")
    ativo: bool = Field(True, description="Status ativo da notificação")
    
    class Config:
        """Configuração do modelo"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "notif_123",
                "tipo": "task_created",
                "titulo": "Nova tarefa criada",
                "mensagem": "Uma nova tarefa foi criada para você",
                "destinatario_id": "user_123",
                "remetente_id": "user_456",
                "prioridade": "normal",
                "categoria": "tarefas",
                "lida": False,
                "data_criacao": "2024-12-19T10:00:00"
            }
        }

class NotificationStats(BaseModel):
    """Estatísticas de notificações por perfil"""
    
    total_notificacoes: int = Field(0, description="Total de notificações")
    notificacoes_nao_lidas: int = Field(0, description="Notificações não lidas")
    notificacoes_hoje: int = Field(0, description="Notificações de hoje")
    notificacoes_semana: int = Field(0, description="Notificações da semana")
    notificacoes_urgentes: int = Field(0, description="Notificações urgentes")
    notificacoes_por_tipo: Dict[str, int] = Field(default_factory=dict, description="Notificações por tipo")
    
    class Config:
        """Configuração do modelo"""
        schema_extra = {
            "example": {
                "total_notificacoes": 25,
                "notificacoes_nao_lidas": 8,
                "notificacoes_hoje": 3,
                "notificacoes_semana": 12,
                "notificacoes_urgentes": 2,
                "notificacoes_por_tipo": {
                    "task_created": 10,
                    "task_completed": 5,
                    "payment_due": 3,
                    "system_alert": 2
                }
            }
        } 
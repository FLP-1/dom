"""
Serviço de Notificações - Gerenciamento completo de notificações

@fileoverview Serviço de notificações do DOM v1
@directory domcore/services
@description Serviço para criar, gerenciar e enviar notificações do sistema
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
import uuid
import logging

from ..models.notification import (
    NotificationDB, 
    NotificationCreate, 
    NotificationUpdate, 
    Notification, 
    NotificationStats
)
from ..core.enums import NotificationType, UserProfile
from ..core.exceptions import NotFoundException, ValidationError, NotificationError
from ..core.db import SessionLocal

logger = logging.getLogger(__name__)

class NotificationService:
    """Serviço para gerenciar notificações do sistema"""
    
    def __init__(self, db: Optional[Session] = None):
        """Inicializa o serviço com sessão do banco"""
        self.db = db or SessionLocal()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if not self.db:
            self.db.close()
    
    def create_notification(self, notification_data: NotificationCreate) -> Notification:
        """
        Cria uma nova notificação
        
        Args:
            notification_data: Dados da notificação a ser criada
            
        Returns:
            Notification: Notificação criada
            
        Raises:
            ValidationError: Se os dados forem inválidos
            NotificationError: Se houver erro na criação
        """
        try:
            # Gera ID único
            notification_id = f"notif_{uuid.uuid4().hex[:12]}"
            
            # Cria instância do banco
            db_notification = NotificationDB(
                id=notification_id,
                tipo=notification_data.tipo.value,
                titulo=notification_data.titulo,
                mensagem=notification_data.mensagem,
                destinatario_id=notification_data.destinatario_id,
                remetente_id=notification_data.remetente_id,
                prioridade=notification_data.prioridade,
                categoria=notification_data.categoria,
                dados_extras=notification_data.dados_extras,
                data_criacao=datetime.utcnow(),
                data_atualizacao=datetime.utcnow()
            )
            
            # Salva no banco
            self.db.add(db_notification)
            self.db.commit()
            self.db.refresh(db_notification)
            
            # Converte para modelo Pydantic
            notification = Notification.from_orm(db_notification)
            
            logger.info(f"✅ Notificação criada: {notification_id}")
            return notification
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Erro ao criar notificação: {e}")
            raise NotificationError(f"Erro ao criar notificação: {str(e)}")
    
    def get_notification(self, notification_id: str) -> Notification:
        """
        Busca uma notificação por ID
        
        Args:
            notification_id: ID da notificação
            
        Returns:
            Notification: Notificação encontrada
            
        Raises:
            NotFoundException: Se a notificação não for encontrada
        """
        db_notification = self.db.query(NotificationDB).filter(
            NotificationDB.id == notification_id,
            NotificationDB.ativo == True
        ).first()
        
        if not db_notification:
            raise NotFoundException(f"Notificação {notification_id} não encontrada")
        
        return Notification.from_orm(db_notification)
    
    def get_user_notifications(
        self, 
        user_id: str, 
        profile: UserProfile,
        limit: int = 50, 
        offset: int = 0,
        unread_only: bool = False,
        notification_type: Optional[NotificationType] = None
    ) -> List[Notification]:
        """
        Busca notificações de um usuário com filtros
        
        Args:
            user_id: ID do usuário
            profile: Perfil do usuário para adaptação
            limit: Limite de resultados
            offset: Offset para paginação
            unread_only: Apenas não lidas
            notification_type: Tipo específico de notificação
            
        Returns:
            List[Notification]: Lista de notificações
        """
        try:
            # Query base
            query = self.db.query(NotificationDB).filter(
                NotificationDB.destinatario_id == user_id,
                NotificationDB.ativo == True
            )
            
            # Filtros adicionais
            if unread_only:
                query = query.filter(NotificationDB.lida == False)
            
            if notification_type:
                query = query.filter(NotificationDB.tipo == notification_type.value)
            
            # Ordenação por data de criação (mais recentes primeiro)
            query = query.order_by(desc(NotificationDB.data_criacao))
            
            # Paginação
            query = query.offset(offset).limit(limit)
            
            # Executa query
            db_notifications = query.all()
            
            # Converte para modelos Pydantic
            notifications = [Notification.from_orm(n) for n in db_notifications]
            
            logger.info(f"📋 Buscadas {len(notifications)} notificações para usuário {user_id}")
            return notifications
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar notificações: {e}")
            return []
    
    def mark_as_read(self, notification_id: str, user_id: str) -> Notification:
        """
        Marca uma notificação como lida
        
        Args:
            notification_id: ID da notificação
            user_id: ID do usuário (para validação)
            
        Returns:
            Notification: Notificação atualizada
            
        Raises:
            NotFoundException: Se a notificação não for encontrada
            ValidationError: Se o usuário não for o destinatário
        """
        try:
            # Busca a notificação
            db_notification = self.db.query(NotificationDB).filter(
                NotificationDB.id == notification_id,
                NotificationDB.ativo == True
            ).first()
            
            if not db_notification:
                raise NotFoundException(f"Notificação {notification_id} não encontrada")
            
            # Valida se o usuário é o destinatário
            if db_notification.destinatario_id != user_id:
                raise ValidationError("Usuário não autorizado a marcar esta notificação como lida")
            
            # Atualiza status
            db_notification.lida = True
            db_notification.data_leitura = datetime.utcnow()
            db_notification.data_atualizacao = datetime.utcnow()
            
            # Salva no banco
            self.db.commit()
            self.db.refresh(db_notification)
            
            notification = Notification.from_orm(db_notification)
            
            logger.info(f"✅ Notificação {notification_id} marcada como lida")
            return notification
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Erro ao marcar notificação como lida: {e}")
            raise
    
    def mark_all_as_read(self, user_id: str) -> int:
        """
        Marca todas as notificações de um usuário como lidas
        
        Args:
            user_id: ID do usuário
            
        Returns:
            int: Número de notificações marcadas como lidas
        """
        try:
            # Busca notificações não lidas
            unread_notifications = self.db.query(NotificationDB).filter(
                NotificationDB.destinatario_id == user_id,
                NotificationDB.lida == False,
                NotificationDB.ativo == True
            ).all()
            
            # Marca como lidas
            now = datetime.utcnow()
            for notification in unread_notifications:
                notification.lida = True
                notification.data_leitura = now
                notification.data_atualizacao = now
            
            # Salva no banco
            self.db.commit()
            
            count = len(unread_notifications)
            logger.info(f"✅ {count} notificações marcadas como lidas para usuário {user_id}")
            return count
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Erro ao marcar notificações como lidas: {e}")
            return 0
    
    def update_notification(self, notification_id: str, update_data: NotificationUpdate) -> Notification:
        """
        Atualiza uma notificação
        
        Args:
            notification_id: ID da notificação
            update_data: Dados para atualização
            
        Returns:
            Notification: Notificação atualizada
            
        Raises:
            NotFoundException: Se a notificação não for encontrada
        """
        try:
            # Busca a notificação
            db_notification = self.db.query(NotificationDB).filter(
                NotificationDB.id == notification_id,
                NotificationDB.ativo == True
            ).first()
            
            if not db_notification:
                raise NotFoundException(f"Notificação {notification_id} não encontrada")
            
            # Atualiza campos fornecidos
            update_dict = update_data.dict(exclude_unset=True)
            for field, value in update_dict.items():
                setattr(db_notification, field, value)
            
            # Atualiza data de modificação
            db_notification.data_atualizacao = datetime.utcnow()
            
            # Salva no banco
            self.db.commit()
            self.db.refresh(db_notification)
            
            notification = Notification.from_orm(db_notification)
            
            logger.info(f"✅ Notificação {notification_id} atualizada")
            return notification
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Erro ao atualizar notificação: {e}")
            raise
    
    def delete_notification(self, notification_id: str, user_id: str) -> bool:
        """
        Deleta uma notificação (soft delete)
        
        Args:
            notification_id: ID da notificação
            user_id: ID do usuário (para validação)
            
        Returns:
            bool: True se deletada com sucesso
            
        Raises:
            NotFoundException: Se a notificação não for encontrada
            ValidationError: Se o usuário não for o destinatário
        """
        try:
            # Busca a notificação
            db_notification = self.db.query(NotificationDB).filter(
                NotificationDB.id == notification_id,
                NotificationDB.ativo == True
            ).first()
            
            if not db_notification:
                raise NotFoundException(f"Notificação {notification_id} não encontrada")
            
            # Valida se o usuário é o destinatário
            if db_notification.destinatario_id != user_id:
                raise ValidationError("Usuário não autorizado a deletar esta notificação")
            
            # Soft delete
            db_notification.ativo = False
            db_notification.data_atualizacao = datetime.utcnow()
            
            # Salva no banco
            self.db.commit()
            
            logger.info(f"✅ Notificação {notification_id} deletada")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Erro ao deletar notificação: {e}")
            raise
    
    def get_notification_stats(self, user_id: str, profile: UserProfile) -> NotificationStats:
        """
        Busca estatísticas de notificações para um usuário
        
        Args:
            user_id: ID do usuário
            profile: Perfil do usuário para adaptação
            
        Returns:
            NotificationStats: Estatísticas de notificações
        """
        try:
            # Filtro base
            base_filter = and_(
                NotificationDB.destinatario_id == user_id,
                NotificationDB.ativo == True
            )
            
            # Total de notificações
            total_notificacoes = self.db.query(func.count(NotificationDB.id)).filter(
                base_filter
            ).scalar() or 0
            
            # Notificações não lidas
            notificacoes_nao_lidas = self.db.query(func.count(NotificationDB.id)).filter(
                base_filter,
                NotificationDB.lida == False
            ).scalar() or 0
            
            # Notificações de hoje
            hoje = datetime.utcnow().date()
            notificacoes_hoje = self.db.query(func.count(NotificationDB.id)).filter(
                base_filter,
                func.date(NotificationDB.data_criacao) == hoje
            ).scalar() or 0
            
            # Notificações da semana
            fim_semana = hoje + timedelta(days=7)
            notificacoes_semana = self.db.query(func.count(NotificationDB.id)).filter(
                base_filter,
                func.date(NotificationDB.data_criacao) <= fim_semana,
                func.date(NotificationDB.data_criacao) >= hoje
            ).scalar() or 0
            
            # Notificações urgentes
            notificacoes_urgentes = self.db.query(func.count(NotificationDB.id)).filter(
                base_filter,
                NotificationDB.prioridade == "urgente"
            ).scalar() or 0
            
            # Notificações por tipo
            notificacoes_por_tipo = {}
            tipos = self.db.query(
                NotificationDB.tipo, 
                func.count(NotificationDB.id)
            ).filter(base_filter).group_by(NotificationDB.tipo).all()
            
            for tipo, count in tipos:
                notificacoes_por_tipo[tipo] = count
            
            stats = NotificationStats(
                total_notificacoes=total_notificacoes,
                notificacoes_nao_lidas=notificacoes_nao_lidas,
                notificacoes_hoje=notificacoes_hoje,
                notificacoes_semana=notificacoes_semana,
                notificacoes_urgentes=notificacoes_urgentes,
                notificacoes_por_tipo=notificacoes_por_tipo
            )
            
            logger.info(f"📊 Estatísticas de notificações geradas para usuário {user_id}")
            return stats
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar estatísticas: {e}")
            # Retorna estatísticas vazias em caso de erro
            return NotificationStats()
    
    def create_system_notification(
        self, 
        titulo: str, 
        mensagem: str, 
        destinatario_id: str,
        notification_type: NotificationType = NotificationType.SYSTEM_ALERT,
        prioridade: str = "normal",
        dados_extras: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """
        Cria uma notificação do sistema
        
        Args:
            titulo: Título da notificação
            mensagem: Mensagem da notificação
            destinatario_id: ID do destinatário
            notification_type: Tipo da notificação
            prioridade: Prioridade da notificação
            dados_extras: Dados extras
            
        Returns:
            Notification: Notificação criada
        """
        notification_data = NotificationCreate(
            tipo=notification_type,
            titulo=titulo,
            mensagem=mensagem,
            destinatario_id=destinatario_id,
            remetente_id=None,  # Sistema
            prioridade=prioridade,
            categoria="sistema",
            dados_extras=dados_extras or {}
        )
        
        return self.create_notification(notification_data)
    
    def create_task_notification(
        self,
        task_id: str,
        task_titulo: str,
        destinatario_id: str,
        notification_type: NotificationType,
        remetente_id: Optional[str] = None,
        prioridade: str = "normal"
    ) -> Notification:
        """
        Cria uma notificação relacionada a tarefas
        
        Args:
            task_id: ID da tarefa
            task_titulo: Título da tarefa
            destinatario_id: ID do destinatário
            notification_type: Tipo da notificação
            remetente_id: ID do remetente
            prioridade: Prioridade da notificação
            
        Returns:
            Notification: Notificação criada
        """
        # Mapeia tipos para títulos e mensagens
        type_messages = {
            NotificationType.TASK_CREATED: {
                "titulo": "Nova Tarefa Criada",
                "mensagem": f"Uma nova tarefa foi criada: {task_titulo}"
            },
            NotificationType.TASK_COMPLETED: {
                "titulo": "Tarefa Concluída",
                "mensagem": f"A tarefa foi concluída: {task_titulo}"
            },
            NotificationType.TASK_OVERDUE: {
                "titulo": "Tarefa Atrasada",
                "mensagem": f"A tarefa está atrasada: {task_titulo}",
                "prioridade": "alta"
            }
        }
        
        message_data = type_messages.get(notification_type, {
            "titulo": "Atualização de Tarefa",
            "mensagem": f"Atualização na tarefa: {task_titulo}"
        })
        
        notification_data = NotificationCreate(
            tipo=notification_type,
            titulo=message_data["titulo"],
            mensagem=message_data["mensagem"],
            destinatario_id=destinatario_id,
            remetente_id=remetente_id,
            prioridade=message_data.get("prioridade", prioridade),
            categoria="tarefas",
            dados_extras={"task_id": task_id, "task_titulo": task_titulo}
        )
        
        return self.create_notification(notification_data) 
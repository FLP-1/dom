"""
Serviço de Tarefas - Lógica de negócio para tarefas

@fileoverview Serviço de tarefas do DOM v1
@directory domcore/services
@description Lógica de negócio para CRUD de tarefas e estatísticas
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
import uuid
import logging

from ..models.task import TaskDB, TaskCreate, TaskUpdate, Task, TaskStats
from ..models.user import UserDB
from ..core.enums import TaskStatus, UserProfile
from ..core.exceptions import NotFoundException, ValidationException, PermissionException
from ..core.messages import message_service

logger = logging.getLogger(__name__)

class TaskService:
    """Serviço para gerenciamento de tarefas"""
    
    @staticmethod
    def _generate_task_id() -> str:
        """Gera ID único para tarefa"""
        return f"task_{uuid.uuid4().hex[:12]}"
    
    @staticmethod
    def _validate_user_permissions(user: UserDB, task: Optional[TaskDB] = None) -> bool:
        """Valida permissões do usuário para tarefas"""
        # Admin e Owner têm acesso total
        if user.perfil in [UserProfile.ADMIN, UserProfile.OWNER]:
            return True
        
        # Se é uma tarefa existente, verificar se é criador ou responsável
        if task:
            return (user.id == task.criador_id or 
                   user.id == task.responsavel_id or
                   user.perfil == UserProfile.EMPREGADOR)
        
        # Para criação, empregadores podem criar tarefas
        return user.perfil == UserProfile.EMPREGADOR
    
    @staticmethod
    def create_task(db: Session, task_data: TaskCreate, current_user: UserDB) -> Task:
        """Cria uma nova tarefa"""
        try:
            # Validar permissões
            if not TaskService._validate_user_permissions(current_user):
                raise PermissionException(message_service.get_task_message("no_permission_create"))
            
            # Criar tarefa
            task_id = TaskService._generate_task_id()
            db_task = TaskDB(
                id=task_id,
                titulo=task_data.titulo,
                descricao=task_data.descricao,
                status=TaskStatus.PENDING,
                prioridade=task_data.prioridade,
                data_limite=task_data.data_limite,
                criador_id=current_user.id,
                responsavel_id=task_data.responsavel_id,
                categoria=task_data.categoria,
                tags=task_data.tags,
                ativo=True
            )
            
            db.add(db_task)
            db.commit()
            db.refresh(db_task)
            
            logger.info(f"✅ Tarefa criada: {task_id} por {current_user.id}")
            return Task.from_orm(db_task)
            
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Erro ao criar tarefa: {e}")
            raise
    
    @staticmethod
    def get_task(db: Session, task_id: str, current_user: UserDB) -> Task:
        """Obtém uma tarefa específica"""
        try:
            task = db.query(TaskDB).filter(
                and_(TaskDB.id == task_id, TaskDB.ativo == True)
            ).first()
            
            if not task:
                raise NotFoundException(message_service.get_task_message("not_found", task_id=task_id))
            
            # Validar permissões
            if not TaskService._validate_user_permissions(current_user, task):
                raise PermissionException(message_service.get_task_message("no_permission_view"))
            
            return Task.from_orm(task)
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar tarefa {task_id}: {e}")
            raise
    
    @staticmethod
    def get_tasks(
        db: Session, 
        current_user: UserDB,
        status: Optional[TaskStatus] = None,
        categoria: Optional[str] = None,
        responsavel_id: Optional[str] = None,
        criador_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Task]:
        """Lista tarefas com filtros"""
        try:
            query = db.query(TaskDB).filter(TaskDB.ativo == True)
            
            # Aplicar filtros baseados no perfil do usuário
            if current_user.perfil == UserProfile.EMPREGADO:
                # Empregados veem apenas suas tarefas
                query = query.filter(TaskDB.responsavel_id == current_user.id)
            elif current_user.perfil == UserProfile.FAMILIAR:
                # Familiares veem tarefas do grupo
                # TODO: Implementar lógica de grupo
                pass
            elif current_user.perfil in [UserProfile.ADMIN, UserProfile.OWNER]:
                # Admin e Owner veem todas as tarefas
                pass
            else:
                # Empregadores veem tarefas que criaram ou são responsáveis
                query = query.filter(
                    or_(
                        TaskDB.criador_id == current_user.id,
                        TaskDB.responsavel_id == current_user.id
                    )
                )
            
            # Aplicar filtros adicionais
            if status:
                query = query.filter(TaskDB.status == status)
            if categoria:
                query = query.filter(TaskDB.categoria == categoria)
            if responsavel_id:
                query = query.filter(TaskDB.responsavel_id == responsavel_id)
            if criador_id:
                query = query.filter(TaskDB.criador_id == criador_id)
            
            # Ordenar por data de criação (mais recentes primeiro)
            query = query.order_by(TaskDB.data_criacao.desc())
            
            # Paginação
            tasks = query.offset(offset).limit(limit).all()
            
            return [Task.from_orm(task) for task in tasks]
            
        except Exception as e:
            logger.error(f"❌ Erro ao listar tarefas: {e}")
            raise
    
    @staticmethod
    def update_task(db: Session, task_id: str, task_data: TaskUpdate, current_user: UserDB) -> Task:
        """Atualiza uma tarefa"""
        try:
            task = db.query(TaskDB).filter(
                and_(TaskDB.id == task_id, TaskDB.ativo == True)
            ).first()
            
            if not task:
                raise NotFoundException(message_service.get_task_message("not_found", task_id=task_id))
            
            # Validar permissões
            if not TaskService._validate_user_permissions(current_user, task):
                raise PermissionException(message_service.get_task_message("no_permission_edit"))
            
            # Atualizar campos
            update_data = task_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                if hasattr(task, field):
                    setattr(task, field, value)
            
            # Atualizar data de atualização
            task.data_atualizacao = datetime.utcnow()
            
            # Se status mudou para completed, definir data_conclusao
            if task_data.status == TaskStatus.COMPLETED and task.status != TaskStatus.COMPLETED:
                task.data_conclusao = datetime.utcnow()
            
            # Se status mudou de completed, limpar data_conclusao
            if task_data.status != TaskStatus.COMPLETED and task.status == TaskStatus.COMPLETED:
                task.data_conclusao = None
            
            db.commit()
            db.refresh(task)
            
            logger.info(f"✅ Tarefa atualizada: {task_id} por {current_user.id}")
            return Task.from_orm(task)
            
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Erro ao atualizar tarefa {task_id}: {e}")
            raise
    
    @staticmethod
    def delete_task(db: Session, task_id: str, current_user: UserDB) -> bool:
        """Remove uma tarefa (soft delete)"""
        try:
            task = db.query(TaskDB).filter(
                and_(TaskDB.id == task_id, TaskDB.ativo == True)
            ).first()
            
            if not task:
                raise NotFoundException(message_service.get_task_message("not_found", task_id=task_id))
            
            # Validar permissões (apenas criador ou admin pode deletar)
            if not (current_user.id == task.criador_id or 
                   current_user.perfil in [UserProfile.ADMIN, UserProfile.OWNER]):
                raise PermissionException(message_service.get_task_message("no_permission_delete"))
            
            # Soft delete
            task.ativo = False
            task.data_atualizacao = datetime.utcnow()
            
            db.commit()
            
            logger.info(f"✅ Tarefa deletada: {task_id} por {current_user.id}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Erro ao deletar tarefa {task_id}: {e}")
            raise
    
    @staticmethod
    def update_task_status(db: Session, task_id: str, status: TaskStatus, current_user: UserDB) -> Task:
        """Atualiza apenas o status de uma tarefa"""
        try:
            task = db.query(TaskDB).filter(
                and_(TaskDB.id == task_id, TaskDB.ativo == True)
            ).first()
            
            if not task:
                raise NotFoundException(message_service.get_task_message("not_found", task_id=task_id))
            
            # Validar permissões
            if not TaskService._validate_user_permissions(current_user, task):
                raise PermissionException(message_service.get_task_message("no_permission_edit"))
            
            # Atualizar status
            task.status = status
            task.data_atualizacao = datetime.utcnow()
            
            # Gerenciar data_conclusao
            if status == TaskStatus.COMPLETED:
                task.data_conclusao = datetime.utcnow()
            elif task.data_conclusao and status != TaskStatus.COMPLETED:
                task.data_conclusao = None
            
            db.commit()
            db.refresh(task)
            
            logger.info(f"✅ Status da tarefa atualizado: {task_id} -> {status} por {current_user.id}")
            return Task.from_orm(task)
            
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Erro ao atualizar status da tarefa {task_id}: {e}")
            raise
    
    @staticmethod
    def get_task_stats(db: Session, current_user: UserDB) -> TaskStats:
        """Obtém estatísticas de tarefas para o usuário"""
        try:
            # Base query baseada no perfil
            base_query = db.query(TaskDB).filter(TaskDB.ativo == True)
            
            if current_user.perfil == UserProfile.EMPREGADO:
                base_query = base_query.filter(TaskDB.responsavel_id == current_user.id)
            elif current_user.perfil in [UserProfile.ADMIN, UserProfile.OWNER]:
                pass  # Ver todas as tarefas
            else:
                base_query = base_query.filter(
                    or_(
                        TaskDB.criador_id == current_user.id,
                        TaskDB.responsavel_id == current_user.id
                    )
                )
            
            # Calcular estatísticas
            total_tarefas = base_query.count()
            
            tarefas_pendentes = base_query.filter(TaskDB.status == TaskStatus.PENDING).count()
            tarefas_em_andamento = base_query.filter(TaskDB.status == TaskStatus.IN_PROGRESS).count()
            tarefas_concluidas = base_query.filter(TaskDB.status == TaskStatus.COMPLETED).count()
            
            # Tarefas atrasadas (pendentes ou em andamento com data_limite passada)
            hoje = datetime.utcnow().date()
            tarefas_atrasadas = base_query.filter(
                and_(
                    TaskDB.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS]),
                    TaskDB.data_limite < hoje
                )
            ).count()
            
            # Tarefas para hoje
            tarefas_hoje = base_query.filter(
                and_(
                    TaskDB.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS]),
                    func.date(TaskDB.data_limite) == hoje
                )
            ).count()
            
            # Tarefas da semana (próximos 7 dias)
            fim_semana = hoje + timedelta(days=7)
            tarefas_semana = base_query.filter(
                and_(
                    TaskDB.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS]),
                    func.date(TaskDB.data_limite) <= fim_semana,
                    func.date(TaskDB.data_limite) >= hoje
                )
            ).count()
            
            return TaskStats(
                total_tarefas=total_tarefas,
                tarefas_pendentes=tarefas_pendentes,
                tarefas_em_andamento=tarefas_em_andamento,
                tarefas_concluidas=tarefas_concluidas,
                tarefas_atrasadas=tarefas_atrasadas,
                tarefas_hoje=tarefas_hoje,
                tarefas_semana=tarefas_semana
            )
            
        except Exception as e:
            logger.error(f"❌ Erro ao calcular estatísticas: {e}")
            raise 
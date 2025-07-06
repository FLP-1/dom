"""
Serviço de Grupos para DOM v1
@fileoverview Serviço de Grupos
@directory domcore/services
@description Serviço para gerenciamento de grupos/núcleos
@created 2024-12-19
@lastModified 2024-12-19
@author DOM Team
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import uuid

from ..models.group import Group, GroupCreate, GroupUpdate, GroupResponse
from ..models.user import UserDB, UserGroupRole
from ..core.exceptions import NotFoundException, ValidationException, PermissionException


class GroupService:
    """Serviço para gerenciamento de grupos"""
    
    @staticmethod
    def create_group(db: Session, group_data: GroupCreate, created_by: str) -> Group:
        """Cria um novo grupo"""
        # Verificar se já existe grupo com mesmo nome
        existing = db.query(Group).filter(
            and_(
                Group.nome == group_data.nome,
                Group.ativo == True
            )
        ).first()
        
        if existing:
            raise ValidationException(f"Já existe um grupo ativo com o nome '{group_data.nome}'")
        
        # Criar grupo
        group = Group(
            nome=group_data.nome,
            descricao=group_data.descricao,
            tipo=group_data.tipo,
            ativo=True
        )
        
        db.add(group)
        db.commit()
        db.refresh(group)
        
        # Adicionar criador como admin do grupo
        UserGroupRole(
            user_id=uuid.UUID(created_by),
            group_id=group.id,
            role="admin",
            ativo=True
        )
        
        db.commit()
        return group
    
    @staticmethod
    def get_group(db: Session, group_id: str) -> Group:
        """Busca um grupo por ID"""
        group = db.query(Group).filter(
            and_(
                Group.id == uuid.UUID(group_id),
                Group.ativo == True
            )
        ).first()
        
        if not group:
            raise NotFoundException(f"Grupo com ID {group_id} não encontrado")
        
        return group
    
    @staticmethod
    def get_groups(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        tipo: Optional[str] = None,
        ativo: Optional[bool] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Busca grupos com filtros"""
        query = db.query(Group)
        
        # Aplicar filtros
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Group.nome.ilike(search_term),
                    Group.descricao.ilike(search_term)
                )
            )
        
        if tipo:
            tipos = tipo.split(',')
            query = query.filter(Group.tipo.in_(tipos))
        
        if ativo is not None:
            query = query.filter(Group.ativo == ativo)
        
        if user_id:
            # Filtrar grupos do usuário
            query = query.join(UserGroupRole).filter(
                and_(
                    UserGroupRole.user_id == uuid.UUID(user_id),
                    UserGroupRole.ativo == True
                )
            )
        
        # Contar total
        total = query.count()
        
        # Aplicar paginação e ordenação
        groups = query.order_by(desc(Group.data_criacao)).offset(skip).limit(limit).all()
        
        return {
            "items": [group.to_dict() for group in groups],
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    def update_group(db: Session, group_id: str, group_data: GroupUpdate) -> Group:
        """Atualiza um grupo"""
        group = GroupService.get_group(db, group_id)
        
        # Verificar se nome já existe (se estiver sendo alterado)
        if group_data.nome and group_data.nome != group.nome:
            existing = db.query(Group).filter(
                and_(
                    Group.nome == group_data.nome,
                    Group.id != uuid.UUID(group_id),
                    Group.ativo == True
                )
            ).first()
            
            if existing:
                raise ValidationException(f"Já existe um grupo ativo com o nome '{group_data.nome}'")
        
        # Atualizar campos
        if group_data.nome is not None:
            group.nome = group_data.nome
        if group_data.descricao is not None:
            group.descricao = group_data.descricao
        if group_data.tipo is not None:
            group.tipo = group_data.tipo
        if group_data.ativo is not None:
            group.ativo = group_data.ativo
        
        group.data_atualizacao = datetime.utcnow()
        
        db.commit()
        db.refresh(group)
        return group
    
    @staticmethod
    def delete_group(db: Session, group_id: str) -> bool:
        """Desativa um grupo (soft delete)"""
        group = GroupService.get_group(db, group_id)
        
        # Verificar se há usuários ativos no grupo
        active_users = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).count()
        
        if active_users > 0:
            raise ValidationException(f"Não é possível excluir o grupo. Há {active_users} usuário(s) ativo(s).")
        
        # Desativar grupo
        group.ativo = False
        group.data_atualizacao = datetime.utcnow()
        
        db.commit()
        return True
    
    @staticmethod
    def get_group_members(
        db: Session,
        group_id: str,
        skip: int = 0,
        limit: int = 100,
        role: Optional[str] = None,
        ativo: Optional[bool] = None
    ) -> Dict[str, Any]:
        """Busca membros de um grupo"""
        query = db.query(UserGroupRole).filter(
            UserGroupRole.group_id == uuid.UUID(group_id)
        )
        
        # Aplicar filtros
        if role:
            roles = role.split(',')
            query = query.filter(UserGroupRole.role.in_(roles))
        
        if ativo is not None:
            query = query.filter(UserGroupRole.ativo == ativo)
        
        # Contar total
        total = query.count()
        
        # Aplicar paginação
        members = query.offset(skip).limit(limit).all()
        
        # Enriquecer com dados do usuário
        enriched_members = []
        for member in members:
            user_data = member.user.to_api_dict() if member.user else {}
            member_data = member.to_dict()
            member_data['user'] = user_data
            enriched_members.append(member_data)
        
        return {
            "items": enriched_members,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    def add_member_to_group(
        db: Session,
        group_id: str,
        user_id: str,
        role: str = "member",
        added_by: Optional[str] = None
    ) -> UserGroupRole:
        """Adiciona um usuário a um grupo"""
        # Verificar se grupo existe
        group = GroupService.get_group(db, group_id)
        
        # Verificar se usuário existe
        user = db.query(UserDB).filter(UserDB.id == uuid.UUID(user_id)).first()
        if not user:
            raise NotFoundException(f"Usuário com ID {user_id} não encontrado")
        
        # Verificar se já é membro ativo
        existing = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).first()
        
        if existing:
            raise ValidationException(f"Usuário já é membro ativo deste grupo")
        
        # Criar ou reativar relacionamento
        user_group = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id)
            )
        ).first()
        
        if user_group:
            # Reativar membro inativo
            user_group.role = role
            user_group.ativo = True
            user_group.updated_at = datetime.utcnow()
        else:
            # Criar novo relacionamento
            user_group = UserGroupRole(
                user_id=uuid.UUID(user_id),
                group_id=uuid.UUID(group_id),
                role=role,
                ativo=True
            )
            db.add(user_group)
        
        db.commit()
        db.refresh(user_group)
        return user_group
    
    @staticmethod
    def remove_member_from_group(db: Session, group_id: str, user_id: str) -> bool:
        """Remove um usuário de um grupo"""
        user_group = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).first()
        
        if not user_group:
            raise NotFoundException(f"Usuário não é membro ativo deste grupo")
        
        # Desativar relacionamento
        user_group.ativo = False
        user_group.updated_at = datetime.utcnow()
        
        db.commit()
        return True
    
    @staticmethod
    def update_member_role(
        db: Session,
        group_id: str,
        user_id: str,
        new_role: str
    ) -> UserGroupRole:
        """Atualiza o papel de um membro no grupo"""
        user_group = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).first()
        
        if not user_group:
            raise NotFoundException(f"Usuário não é membro ativo deste grupo")
        
        user_group.role = new_role
        user_group.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(user_group)
        return user_group
    
    @staticmethod
    def get_group_stats(db: Session, group_id: str) -> Dict[str, Any]:
        """Retorna estatísticas de um grupo"""
        group = GroupService.get_group(db, group_id)
        
        # Contar membros por papel
        member_stats = db.query(
            UserGroupRole.role,
            func.count(UserGroupRole.id).label('count')
        ).filter(
            and_(
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).group_by(UserGroupRole.role).all()
        
        # Contar total de membros
        total_members = sum(stat.count for stat in member_stats)
        
        # Contar membros ativos vs inativos
        active_members = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).count()
        
        inactive_members = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == False
            )
        ).count()
        
        # Estatísticas por papel
        roles_stats = {}
        for stat in member_stats:
            roles_stats[stat.role] = stat.count
        
        return {
            "group_id": str(group.id),
            "group_name": group.nome,
            "total_members": total_members,
            "active_members": active_members,
            "inactive_members": inactive_members,
            "roles_distribution": roles_stats,
            "created_at": group.data_criacao.isoformat() if group.data_criacao else None,
            "updated_at": group.data_atualizacao.isoformat() if group.data_atualizacao else None
        }
    
    @staticmethod
    def get_user_groups(db: Session, user_id: str) -> List[Dict[str, Any]]:
        """Retorna todos os grupos de um usuário"""
        user_groups = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.ativo == True
            )
        ).all()
        
        result = []
        for user_group in user_groups:
            if user_group.grupo:
                group_data = user_group.grupo.to_dict()
                group_data['user_role'] = user_group.role
                group_data['joined_at'] = user_group.created_at.isoformat() if user_group.created_at else None
                result.append(group_data)
        
        return result
    
    @staticmethod
    def check_user_permission(
        db: Session,
        user_id: str,
        group_id: str,
        required_role: str = "member"
    ) -> bool:
        """Verifica se usuário tem permissão no grupo"""
        user_group = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id),
                UserGroupRole.ativo == True
            )
        ).first()
        
        if not user_group:
            return False
        
        # Hierarquia de papéis
        role_hierarchy = {
            "admin": 3,
            "moderator": 2,
            "member": 1
        }
        
        user_role_level = role_hierarchy.get(user_group.role, 0)
        required_role_level = role_hierarchy.get(required_role, 0)
        
        return user_role_level >= required_role_level 
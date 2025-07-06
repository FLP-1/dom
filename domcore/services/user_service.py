"""
@fileoverview Serviço de usuários
@directory domcore/services
@description Serviço para gerenciar usuários do sistema
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from datetime import datetime, timedelta
import uuid
from passlib.context import CryptContext

from ..models.user import UserDB, UserGroupRole
from ..models.group import Group
from ..core.exceptions import NotFoundException, ValidationError, DuplicateError
from ..utils.cpf_validator import CPFValidator

# Configuração para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    """Serviço para gerenciar usuários"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifica se a senha está correta"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Gera hash da senha"""
        return pwd_context.hash(password)
    
    @staticmethod
    def get_users(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        perfil: Optional[str] = None,
        status: Optional[str] = None,
        ativo: Optional[bool] = None,
        grupo: Optional[str] = None
    ) -> Dict[str, Any]:
        """Busca usuários com filtros"""
        query = db.query(UserDB)
        
        # Aplicar filtros
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    UserDB.nome.ilike(search_term),
                    UserDB.email.ilike(search_term),
                    UserDB.cpf.ilike(search_term),
                    UserDB.nickname.ilike(search_term)
                )
            )
        
        if perfil:
            perfis = perfil.split(',')
            query = query.filter(UserDB.perfil.in_(perfis))
        
        if status:
            # Mapear status para ativo
            if status == "active":
                query = query.filter(UserDB.ativo == True)
            elif status == "inactive":
                query = query.filter(UserDB.ativo == False)
            # Para outros status, usar ativo como base
            elif status == "pending":
                query = query.filter(UserDB.ativo == True)  # Pendentes são ativos
            elif status == "blocked":
                query = query.filter(UserDB.ativo == False)  # Bloqueados são inativos
        
        if ativo is not None:
            query = query.filter(UserDB.ativo == ativo)
        
        if grupo:
            # Filtrar por grupo
            query = query.join(UserGroupRole).join(Group).filter(
                and_(
                    Group.id == uuid.UUID(grupo),
                    UserGroupRole.ativo == True
                )
            )
        
        # Contar total
        total = query.count()
        
        # Aplicar paginação
        users = query.offset(skip).limit(limit).all()
        
        return {
            "items": [user.to_api_dict() for user in users],
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    def get_user(db: Session, user_id: str) -> UserDB:
        """Busca usuário por ID"""
        user = db.query(UserDB).filter(UserDB.id == uuid.UUID(user_id)).first()
        if not user:
            raise NotFoundException(f"Usuário com ID {user_id} não encontrado")
        return user
    
    @staticmethod
    def get_user_by_cpf(db: Session, cpf: str) -> Optional[UserDB]:
        """Busca usuário por CPF"""
        return db.query(UserDB).filter(UserDB.cpf == cpf).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[UserDB]:
        """Busca usuário por email"""
        return db.query(UserDB).filter(UserDB.email == email).first()
    
    @staticmethod
    def create_user(db: Session, user_data: Dict[str, Any]) -> UserDB:
        """Cria novo usuário"""
        # Validar CPF
        if not CPFValidator.validate_cpf(user_data["cpf"]):
            raise ValidationError("CPF inválido")
        
        # Verificar se CPF já existe
        if UserService.get_user_by_cpf(db, user_data["cpf"]):
            raise DuplicateError("CPF já cadastrado")
        
        # Verificar se email já existe (se fornecido)
        if user_data.get("email") and UserService.get_user_by_email(db, user_data["email"]):
            raise DuplicateError("Email já cadastrado")
        
        # Verificar se nickname já existe (se fornecido)
        if user_data.get("nickname"):
            existing_nickname = db.query(UserDB).filter(UserDB.nickname == user_data["nickname"]).first()
            if existing_nickname:
                raise DuplicateError("Nickname já cadastrado")
        
        # Criar usuário
        user = UserDB(
            nome=user_data["name"],
            nickname=user_data.get("nickname"),
            cpf=user_data["cpf"],
            email=user_data.get("email"),
            celular=user_data.get("celular"),
            perfil=user_data["perfil"],
            senha_hash=UserService.get_password_hash(user_data["password"]),
            status="active",
            ativo=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Adicionar a grupos se especificado
        if user_data.get("grupos"):
            for grupo_id in user_data["grupos"]:
                UserService.add_user_to_group(db, str(user.id), grupo_id)
        
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: str, user_data: Dict[str, Any]) -> UserDB:
        """Atualiza usuário"""
        user = UserService.get_user(db, user_id)
        
        # Verificar se email já existe (se fornecido)
        if user_data.get("email") and user_data["email"] != user.email:
            existing_email = UserService.get_user_by_email(db, user_data["email"])
            if existing_email:
                raise DuplicateError("Email já cadastrado")
        
        # Verificar se nickname já existe (se fornecido)
        if user_data.get("nickname") and user_data["nickname"] != user.nickname:
            existing_nickname = db.query(UserDB).filter(UserDB.nickname == user_data["nickname"]).first()
            if existing_nickname:
                raise DuplicateError("Nickname já cadastrado")
        
        # Atualizar campos
        for field, value in user_data.items():
            if field == "password" and value:
                user.senha_hash = UserService.get_password_hash(value)
            elif field == "name":
                user.nome = value
            elif field in ["nickname", "email", "celular", "perfil", "ativo"]:
                setattr(user, field, value)
        
        user.data_atualizacao = datetime.utcnow()
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def delete_user(db: Session, user_id: str) -> bool:
        """Deleta usuário (soft delete)"""
        user = UserService.get_user(db, user_id)
        user.ativo = False
        user.data_atualizacao = datetime.utcnow()
        db.commit()
        return True
    
    @staticmethod
    def activate_user(db: Session, user_id: str) -> UserDB:
        """Ativa usuário"""
        user = UserService.get_user(db, user_id)
        user.ativo = True
        user.data_atualizacao = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def deactivate_user(db: Session, user_id: str) -> UserDB:
        """Desativa usuário"""
        user = UserService.get_user(db, user_id)
        user.ativo = False
        user.data_atualizacao = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def add_user_to_group(db: Session, user_id: str, group_id: str, role: str = "member") -> UserGroupRole:
        """Adiciona usuário a um grupo"""
        # Verificar se relacionamento já existe
        existing = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id)
            )
        ).first()
        
        if existing:
            existing.role = role
            existing.ativo = True
            existing.updated_at = datetime.utcnow()
            db.commit()
            return existing
        
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
    def remove_user_from_group(db: Session, user_id: str, group_id: str) -> bool:
        """Remove usuário de um grupo"""
        user_group = db.query(UserGroupRole).filter(
            and_(
                UserGroupRole.user_id == uuid.UUID(user_id),
                UserGroupRole.group_id == uuid.UUID(group_id)
            )
        ).first()
        
        if user_group:
            user_group.ativo = False
            user_group.updated_at = datetime.utcnow()
            db.commit()
            return True
        
        return False
    
    @staticmethod
    def get_user_stats(db: Session) -> Dict[str, Any]:
        """Obtém estatísticas de usuários"""
        total_usuarios = db.query(UserDB).count()
        usuarios_ativos = db.query(UserDB).filter(UserDB.ativo == True).count()
        usuarios_inativos = db.query(UserDB).filter(UserDB.ativo == False).count()
        
        # Usuários por perfil
        usuarios_por_perfil = {}
        perfis = db.query(UserDB.perfil, func.count(UserDB.id)).group_by(UserDB.perfil).all()
        for perfil, count in perfis:
            usuarios_por_perfil[perfil] = count
        
        # Novos usuários este mês
        inicio_mes = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        novos_usuarios_mes = db.query(UserDB).filter(UserDB.data_criacao >= inicio_mes).count()
        
        # Usuários online (últimos 15 minutos)
        online_threshold = datetime.utcnow() - timedelta(minutes=15)
        usuarios_online = db.query(UserDB).filter(
            and_(
                UserDB.ultimo_acesso >= online_threshold,
                UserDB.ativo == True
            )
        ).count()
        
        return {
            "total_usuarios": total_usuarios,
            "usuarios_ativos": usuarios_ativos,
            "usuarios_inativos": usuarios_inativos,
            "usuarios_por_perfil": usuarios_por_perfil,
            "novos_usuarios_mes": novos_usuarios_mes,
            "usuarios_online": usuarios_online
        }
    
    @staticmethod
    def update_last_access(db: Session, user_id: str) -> None:
        """Atualiza último acesso do usuário"""
        user = db.query(UserDB).filter(UserDB.id == uuid.UUID(user_id)).first()
        if user:
            user.ultimo_login = datetime.utcnow()
            db.commit() 
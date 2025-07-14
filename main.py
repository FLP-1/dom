"""
DOM v1 - Servidor FastAPI
Servidor principal do sistema de gestão doméstica

@fileoverview Servidor FastAPI principal do DOM v1
@directory .
@description Servidor FastAPI com endpoints de autenticação e API usando PostgreSQL
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import base64
import re
import uuid

# Importar módulos do domcore
import sys
sys.path.append('domcore')

# Adicionar logs para debug
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

try:
    from domcore.core.db import SessionLocal, engine
    logger.info("✅ Engine importado com sucesso")
except Exception as e:
    logger.error(f"❌ Erro ao importar engine: {e}")
    raise

try:
    from domcore.models.user import UserDB, UserSession, UserGroupRole
    from domcore.models.group import Group, GroupCreate, GroupUpdate
    from domcore.models.task import TaskCreate, TaskUpdate, Task, TaskStats
    from domcore.services.task_service import TaskService
    from domcore.services.group_service import GroupService
    logger.info("✅ Modelos e serviços importados com sucesso")
except Exception as e:
    logger.error(f"❌ Erro ao importar modelos: {e}")
    raise

# Carregar variáveis de ambiente
load_dotenv()

# Configurações
SECRET_KEY = os.getenv("SECRET_KEY", "dom-v1-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuração de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração de segurança
security = HTTPBearer()

# Criar aplicação FastAPI
app = FastAPI(
    title="DOM v1 - Sistema de Gestão Doméstica",
    description="API para gestão de empregados domésticos",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class UserLogin(BaseModel):
    cpf: str
    password: str
    profile: Optional[str] = "empregador"

class UserResponse(BaseModel):
    id: str
    name: str
    cpf: str
    profile: str
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    cpf: Optional[str] = None

# Dependency para obter sessão do banco
def get_db():
    logger.info("🔄 Iniciando get_db()")
    try:
        logger.info("🔄 Criando SessionLocal...")
        db = SessionLocal()
        logger.info("✅ SessionLocal criado com sucesso")
        try:
            yield db
        finally:
            logger.info("🔄 Fechando sessão...")
            db.close()
            logger.info("✅ Sessão fechada")
    except Exception as e:
        logger.error(f"❌ Erro em get_db(): {type(e).__name__}: {str(e)}")
        logger.error(f"Detalhes do erro: {e}")
        raise

# Funções utilitárias
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha está correta"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token de acesso JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def clean_cpf(cpf: str) -> str:
    """Remove qualquer máscara do CPF"""
    return re.sub(r'\D', '', cpf)

def get_user_by_cpf(db: Session, cpf: str):
    """Busca usuário por CPF limpo no banco de dados"""
    cpf_clean = clean_cpf(cpf)
    return db.query(UserDB).filter(UserDB.cpf == cpf_clean, UserDB.ativo == True).first()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Obtém usuário atual baseado no token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        cpf: str = payload.get("sub")
        if cpf is None:
            raise credentials_exception
        token_data = TokenData(cpf=cpf)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = get_user_by_cpf(db, cpf=token_data.cpf)
    if user is None:
        raise credentials_exception
    return user

# Endpoints
@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": "DOM v1 - Sistema de Gestão Doméstica",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    """Verificação de saúde da API"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@app.post("/api/auth/login")
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Endpoint de login"""
    # Buscar usuário no banco
    user = get_user_by_cpf(db, user_credentials.cpf)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(user_credentials.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user.ultimo_login = datetime.utcnow()
    db.commit()
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.cpf, "profile": user.perfil},
        expires_delta=access_token_expires
    )
    photo_b64 = base64.b64encode(user.user_photo).decode() if user.user_photo else None
    # Cria uma nova sessão (mantendo múltiplas sessões)
    session = UserSession(
        id=uuid.uuid4(),
        user_id=user.id,
        session_token=access_token,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + access_token_expires,
        active_context_group_id=None,
        active_context_role=None,
        user_agent=None,
        ip_address=None
    )
    db.add(session)
    db.commit()
    return {
        "success": True,
        "id": user.id,
        "name": user.nome,
        "nickname": user.nickname,
        "cpf": user.cpf,
        "profile": user.perfil,
        "email": user.email,
        "celular": user.celular,
        "user_photo": photo_b64,
        "access_token": access_token
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: UserDB = Depends(get_current_user)):
    """Obtém informações do usuário atual"""
    photo_b64 = base64.b64encode(current_user.user_photo).decode() if current_user.user_photo else None
    return {
        "id": current_user.id,
        "name": current_user.nome,
        "nickname": current_user.nickname,
        "cpf": current_user.cpf,
        "profile": current_user.perfil,
        "email": current_user.email,
        "celular": current_user.celular,
        "user_photo": photo_b64
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: UserDB = Depends(get_current_user)):
    """Obtém estatísticas do dashboard"""
    return {
        "tasks_active": 12,
        "notifications": 3,
        "users_online": 5,
        "profile": current_user.perfil
    }

@app.get("/api/users")
async def get_users(db: Session = Depends(get_db)):
    """Lista todos os usuários (para desenvolvimento)"""
    users = db.query(UserDB).filter(UserDB.ativo == True).all()
    return [
        {
            "id": user.id,
            "nome": user.nome,
            "cpf": user.cpf,
            "email": user.email,
            "perfil": user.perfil,
            "ativo": user.ativo
        }
        for user in users
    ]

# Endpoint: Buscar contextos disponíveis do usuário logado
@app.get("/api/auth/contexts")
async def get_user_contexts(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retorna todos os contextos (grupo/perfil) do usuário logado"""
    roles = db.query(UserGroupRole).filter(UserGroupRole.user_id == current_user.id).all()
    return [
        {
            'groupId': str(r.group_id),
            'groupName': r.group.nome if r.group else "Grupo não encontrado",
            'role': r.role,
            'profile': r.role  # ou mapeie para o profile correto
        }
        for r in roles
    ]

# Endpoint: Atualizar o contexto ativo da sessão
class ContextUpdateRequest(BaseModel):
    groupId: str
    role: str

@app.post("/api/auth/session/context")
async def update_session_context(
    req: Request,
    context: ContextUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    """Atualiza o contexto ativo da sessão do usuário"""
    # Recuperar token do header Authorization
    token = req.headers.get('authorization', '').replace('Bearer ', '')
    session = db.query(UserSession).filter_by(user_id=current_user.id, session_token=token).first()
    if not session:
        raise HTTPException(status_code=401, detail="Sessão não encontrada")
    session.active_context_group_id = context.groupId
    session.active_context_role = context.role
    db.commit()
    return {"ok": True, "active_context_group_id": context.groupId, "active_context_role": context.role}

# Endpoint: Retornar o contexto ativo da sessão
@app.get("/api/auth/session/context")
async def get_session_context(
    req: Request,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    token = req.headers.get('authorization', '').replace('Bearer ', '')
    session = db.query(UserSession).filter_by(user_id=current_user.id, session_token=token).first()
    if not session:
        raise HTTPException(status_code=401, detail="Sessão não encontrada")
    return {
        "active_context_group_id": session.active_context_group_id,
        "active_context_role": session.active_context_role
    }

# ============================================================================
# ENDPOINTS DE TAREFAS
# ============================================================================

@app.get("/api/tasks")
async def get_tasks(
    status: Optional[str] = None,
    categoria: Optional[str] = None,
    responsavel_id: Optional[str] = None,
    criador_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista tarefas com filtros"""
    try:
        from domcore.core.enums import TaskStatus
        
        # Converter string para enum se fornecido
        status_enum = None
        if status:
            try:
                status_enum = TaskStatus(status)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Status inválido: {status}"
                )
        
        tasks = TaskService.get_tasks(
            db=db,
            current_user=current_user,
            status=status_enum,
            categoria=categoria,
            responsavel_id=responsavel_id,
            criador_id=criador_id,
            limit=limit,
            offset=offset
        )
        
        return {
            "tasks": [task.dict() for task in tasks],
            "total": len(tasks),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar tarefas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/tasks/stats")
async def get_task_stats(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtém estatísticas de tarefas"""
    try:
        stats = TaskService.get_task_stats(db=db, current_user=current_user)
        return stats.dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/tasks/{task_id}")
async def get_task(
    task_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtém uma tarefa específica"""
    try:
        task = TaskService.get_task(db=db, task_id=task_id, current_user=current_user)
        return task.dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao buscar tarefa {task_id}: {e}")
        if "não encontrada" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada"
            )
        elif "permissão" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.post("/api/tasks")
async def create_task(
    task_data: TaskCreate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria uma nova tarefa"""
    try:
        task = TaskService.create_task(db=db, task_data=task_data, current_user=current_user)
        return task.dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao criar tarefa: {e}")
        if "permissão" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.put("/api/tasks/{task_id}")
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza uma tarefa"""
    try:
        task = TaskService.update_task(db=db, task_id=task_id, task_data=task_data, current_user=current_user)
        return task.dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar tarefa {task_id}: {e}")
        if "não encontrada" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada"
            )
        elif "permissão" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.delete("/api/tasks/{task_id}")
async def delete_task(
    task_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove uma tarefa"""
    try:
        success = TaskService.delete_task(db=db, task_id=task_id, current_user=current_user)
        return {"success": success, "message": "Tarefa removida com sucesso"}
        
    except Exception as e:
        logger.error(f"❌ Erro ao deletar tarefa {task_id}: {e}")
        if "não encontrada" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada"
            )
        elif "permissão" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.patch("/api/tasks/{task_id}/status")
async def update_task_status(
    task_id: str,
    status: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza apenas o status de uma tarefa"""
    try:
        from domcore.core.enums import TaskStatus
        
        try:
            status_enum = TaskStatus(status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status inválido: {status}"
            )
        
        task = TaskService.update_task_status(db=db, task_id=task_id, status=status_enum, current_user=current_user)
        return task.dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar status da tarefa {task_id}: {e}")
        if "não encontrada" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarefa não encontrada"
            )
        elif "permissão" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

# ============================================================================
# ENDPOINTS DE GRUPOS
# ============================================================================

@app.get("/api/groups")
async def get_groups(
    search: Optional[str] = None,
    tipo: Optional[str] = None,
    ativo: Optional[bool] = None,
    user_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista grupos com filtros"""
    try:
        result = GroupService.get_groups(
            db=db,
            skip=offset,
            limit=limit,
            search=search,
            tipo=tipo,
            ativo=ativo,
            user_id=user_id or str(current_user.id)
        )
        return result
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar grupos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/groups/{group_id}")
async def get_group(
    group_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtém um grupo específico"""
    try:
        group = GroupService.get_group(db=db, group_id=group_id)
        return group.to_dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao buscar grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo não encontrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.post("/api/groups")
async def create_group(
    group_data: GroupCreate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria um novo grupo"""
    try:
        group = GroupService.create_group(
            db=db,
            group_data=group_data,
            created_by=str(current_user.id)
        )
        return group.to_dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao criar grupo: {e}")
        if "já existe" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.put("/api/groups/{group_id}")
async def update_group(
    group_id: str,
    group_data: GroupUpdate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza um grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Apenas administradores podem editar grupos."
            )
        
        group = GroupService.update_group(db=db, group_id=group_id, group_data=group_data)
        return group.to_dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo não encontrado"
            )
        elif "já existe" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.delete("/api/groups/{group_id}")
async def delete_group(
    group_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove um grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Apenas administradores podem excluir grupos."
            )
        
        success = GroupService.delete_group(db=db, group_id=group_id)
        return {"success": success, "message": "Grupo removido com sucesso"}
        
    except Exception as e:
        logger.error(f"❌ Erro ao deletar grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo não encontrado"
            )
        elif "não é possível excluir" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.get("/api/groups/{group_id}/members")
async def get_group_members(
    group_id: str,
    role: Optional[str] = None,
    ativo: Optional[bool] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista membros de um grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "member"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Você não é membro deste grupo."
            )
        
        result = GroupService.get_group_members(
            db=db,
            group_id=group_id,
            skip=offset,
            limit=limit,
            role=role,
            ativo=ativo
        )
        return result
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar membros do grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo não encontrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.post("/api/groups/{group_id}/members")
async def add_group_member(
    group_id: str,
    user_id: str,
    role: str = "member",
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adiciona um usuário a um grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Apenas administradores podem adicionar membros."
            )
        
        user_group = GroupService.add_member_to_group(
            db=db,
            group_id=group_id,
            user_id=user_id,
            role=role,
            added_by=str(current_user.id)
        )
        return user_group.to_dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao adicionar membro ao grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo ou usuário não encontrado"
            )
        elif "já é membro" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.delete("/api/groups/{group_id}/members/{user_id}")
async def remove_group_member(
    group_id: str,
    user_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove um usuário de um grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Apenas administradores podem remover membros."
            )
        
        success = GroupService.remove_member_from_group(db=db, group_id=group_id, user_id=user_id)
        return {"success": success, "message": "Membro removido com sucesso"}
        
    except Exception as e:
        logger.error(f"❌ Erro ao remover membro do grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo ou usuário não encontrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.patch("/api/groups/{group_id}/members/{user_id}/role")
async def update_member_role(
    group_id: str,
    user_id: str,
    role: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza o papel de um membro no grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Apenas administradores podem alterar papéis."
            )
        
        user_group = GroupService.update_member_role(db=db, group_id=group_id, user_id=user_id, new_role=role)
        return user_group.to_dict()
        
    except Exception as e:
        logger.error(f"❌ Erro ao atualizar papel do membro {user_id} no grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo ou usuário não encontrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.get("/api/groups/{group_id}/stats")
async def get_group_stats(
    group_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtém estatísticas de um grupo"""
    try:
        # Verificar permissão
        if not GroupService.check_user_permission(db, str(current_user.id), group_id, "member"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Você não é membro deste grupo."
            )
        
        stats = GroupService.get_group_stats(db=db, group_id=group_id)
        return stats
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter estatísticas do grupo {group_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grupo não encontrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

@app.get("/api/users/{user_id}/groups")
async def get_user_groups(
    user_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtém todos os grupos de um usuário"""
    try:
        # Verificar se é o próprio usuário ou admin
        if str(current_user.id) != user_id:
            # Verificar se current_user é admin em algum grupo do usuário
            user_groups = GroupService.get_user_groups(db, user_id)
            has_permission = False
            
            for group in user_groups:
                if GroupService.check_user_permission(db, str(current_user.id), group['id'], "admin"):
                    has_permission = True
                    break
            
            if not has_permission:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Acesso negado. Você não tem permissão para ver os grupos deste usuário."
                )
        
        groups = GroupService.get_user_groups(db=db, user_id=user_id)
        return {"groups": groups}
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter grupos do usuário {user_id}: {e}")
        if "não encontrado" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno do servidor"
            )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 
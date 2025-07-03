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

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Importar módulos do domcore
import sys
sys.path.append('domcore')

from domcore.core.db import SessionLocal, engine
from domcore.models.user import UserDB, UserSessionDB

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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

def get_user_by_cpf(db: Session, cpf: str):
    """Busca usuário por CPF no banco de dados"""
    return db.query(UserDB).filter(UserDB.cpf == cpf, UserDB.ativo == True).first()

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

@app.post("/api/auth/login", response_model=UserResponse)
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
    
    # Verificar senha
    if not verify_password(user_credentials.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Atualizar último login
    user.ultimo_login = datetime.utcnow()
    db.commit()
    
    # Criar token de acesso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.cpf, "profile": user.perfil}, 
        expires_delta=access_token_expires
    )
    
    return UserResponse(
        id=user.id,
        name=user.nome,
        cpf=user.cpf,
        profile=user.perfil,
        access_token=access_token
    )

@app.get("/api/auth/me")
async def get_current_user_info(current_user: UserDB = Depends(get_current_user)):
    """Obtém informações do usuário atual"""
    return {
        "id": current_user.id,
        "name": current_user.nome,
        "cpf": current_user.cpf,
        "profile": current_user.perfil,
        "email": current_user.email,
        "telefone": current_user.telefone
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

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 
"""
@fileoverview Configuração do SQLAlchemy para PostgreSQL
@directory domcore/core
@description Conexão e engine do banco de dados PostgreSQL usando SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import config
import os

# Usar configurações do config.py
db_config = config.database

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{db_config.username}:{db_config.password}@{db_config.host}:{db_config.port}/{db_config.database}"
)

# Configurações de encoding mais robustas
connect_args = {
    "client_encoding": "utf8",
    "options": "-c client_encoding=utf8",
    "connect_timeout": 10
}

engine = create_engine(
    DATABASE_URL, 
    echo=False, 
    future=True, 
    connect_args=connect_args,
    pool_size=db_config.pool_size,
    max_overflow=db_config.max_overflow
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() 
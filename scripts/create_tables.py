"""
Cria todas as tabelas necessárias para o sistema DOM v1
@created 2024-12-19
@author DOM Team
"""
from sqlalchemy import create_engine, text
import os
from sqlalchemy import create_engine, text

# Configuração do banco
DATABASE_URL = "postgresql://postgres:FLP*2025@localhost:5432/db_dom"

engine = create_engine(DATABASE_URL)

# SQL para criar as tabelas
create_tables_sql = """
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(20) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL, -- CPF sem máscara (11 dígitos)
    email VARCHAR(255) UNIQUE NOT NULL,
    photo BYTEA NOT NULL, -- Foto em bytes
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de grupos
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de papéis dos usuários nos grupos (contextos)
CREATE TABLE IF NOT EXISTS user_group_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, group_id)
);

-- Tabela de sessões dos usuários
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    active_group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    active_role VARCHAR(50) CHECK (active_role IN ('empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_group_roles_user_id ON user_group_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_group_roles_group_id ON user_group_roles(group_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
"""

print('Criando tabelas...')
with engine.connect() as conn:
    conn.execute(text(create_tables_sql))
    conn.commit()
print('Tabelas criadas com sucesso!') 
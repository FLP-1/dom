"""
Script para criar tabelas no banco de dados DOM v1

@fileoverview Script de criação de tabelas
@directory .
@description Cria todas as tabelas necessárias no PostgreSQL
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from datetime import datetime
import uuid

# Adicionar o diretório domcore ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'domcore'))

from domcore.core.db import Base, engine, SessionLocal
from domcore.models.user import UserDB, UserSessionDB

# Configuração de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    """Cria todas as tabelas no banco de dados"""
    print("🔄 Criando tabelas no banco de dados...")
    
    try:
        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
        
        # Verificar se as tabelas foram criadas
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('users', 'user_sessions')
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result]
            print(f"📋 Tabelas encontradas: {', '.join(tables)}")
            
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        return False
    
    return True

def insert_sample_data():
    """Insere dados de exemplo nas tabelas"""
    print("🔄 Inserindo dados de exemplo...")
    
    try:
        db = SessionLocal()
        
        # Verificar se já existem usuários
        existing_users = db.query(UserDB).count()
        if existing_users > 0:
            print("ℹ️  Usuários já existem no banco. Pulando inserção de dados de exemplo.")
            return True
        
        # Dados de exemplo
        sample_users = [
            {
                "id": str(uuid.uuid4()),
                "cpf": "12345678901",
                "nome": "Maria Silva",
                "email": "maria@dom.com",
                "telefone": "(11) 99999-9999",
                "perfil": "empregador",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "write", "manage_tasks"]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "98765432100",
                "nome": "Ana Santos",
                "email": "ana@dom.com",
                "telefone": "(11) 88888-8888",
                "perfil": "empregado",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web", "mobile"],
                "permissoes": ["read", "update_tasks"]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "11122233344",
                "nome": "João Silva",
                "email": "joao@dom.com",
                "telefone": "(11) 77777-7777",
                "perfil": "familiar",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "view_family"]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "55566677788",
                "nome": "Carlos Empresário",
                "email": "carlos@empresa.com",
                "telefone": "(11) 66666-6666",
                "perfil": "parceiro",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "write", "admin"]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "99988877766",
                "nome": "Admin DOM",
                "email": "admin@dom.com",
                "telefone": "(11) 55555-5555",
                "perfil": "admin",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "write", "admin", "system"]
            }
        ]
        
        # Inserir usuários
        for user_data in sample_users:
            user = UserDB(**user_data)
            db.add(user)
        
        db.commit()
        print(f"✅ {len(sample_users)} usuários inseridos com sucesso!")
        
        # Listar usuários criados
        users = db.query(UserDB).all()
        print("\n📋 Usuários criados:")
        for user in users:
            print(f"  - {user.nome} ({user.cpf}) - {user.perfil}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro ao inserir dados: {e}")
        db.rollback()
        db.close()
        return False

def test_connection():
    """Testa a conexão com o banco de dados"""
    print("🔄 Testando conexão com o banco de dados...")
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Conexão bem-sucedida! PostgreSQL: {version}")
            return True
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 Iniciando configuração do banco de dados DOM v1")
    print("=" * 50)
    
    # Testar conexão
    if not test_connection():
        print("❌ Não foi possível conectar ao banco de dados.")
        print("Verifique se o PostgreSQL está rodando e as credenciais estão corretas.")
        return
    
    # Criar tabelas
    if not create_tables():
        print("❌ Falha ao criar tabelas.")
        return
    
    # Inserir dados de exemplo
    if not insert_sample_data():
        print("❌ Falha ao inserir dados de exemplo.")
        return
    
    print("\n" + "=" * 50)
    print("🎉 Configuração do banco de dados concluída!")
    print("\n📋 Credenciais de teste:")
    print("  - Maria (Empregadora): 123.456.789-01 / 123456")
    print("  - Ana (Empregada): 987.654.321-00 / 123456")
    print("  - João (Familiar): 111.222.333-44 / 123456")
    print("  - Carlos (Parceiro): 555.666.777-88 / 123456")
    print("  - Admin: 999.888.777-66 / 123456")

if __name__ == "__main__":
    main() 
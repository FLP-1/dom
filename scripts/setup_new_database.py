#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script para configurar novo banco de dados DOM v1

@fileoverview Script de configuração do novo banco
@directory scripts
@description Configura e testa conexão com novo banco PostgreSQL
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from datetime import datetime
import uuid
from domcore.utils.cpf_validator import CPFValidator

# Configurações do novo banco
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'db_dom',
    'username': 'postgres',
    'password': 'FLP*2025'
}

# URL de conexão
DATABASE_URL = f"postgresql://{DB_CONFIG['username']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}?client_encoding=utf8"

def test_connection():
    """Testa a conexão com o novo banco"""
    print("🔄 Testando conexão com o novo banco de dados...")
    print(f"📋 Configurações:")
    print(f"   Host: {DB_CONFIG['host']}")
    print(f"   Porta: {DB_CONFIG['port']}")
    print(f"   Banco: {DB_CONFIG['database']}")
    print(f"   Usuário: {DB_CONFIG['username']}")
    print(f"   Encoding: UTF8")
    print(f"   Collation: Portuguese_Brazil, 1252")
    print()
    
    try:
        engine = create_engine(
            DATABASE_URL,
            echo=True,
            future=True,
            connect_args={"client_encoding": "utf8"}
        )
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Conexão bem-sucedida!")
            print(f"📊 PostgreSQL: {version}")
            return True
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False

def create_tables():
    """Cria as tabelas no novo banco"""
    print("\n🔄 Criando tabelas no banco de dados...")
    
    try:
        # Importar modelos
        from domcore.core.db import Base
        from domcore.models.user import UserDB, UserSessionDB
        from domcore.models.task import TaskDB
        from domcore.models.notification import NotificationDB
        
        # Criar engine com nova URL
        engine = create_engine(
            DATABASE_URL,
            echo=True,
            future=True,
            connect_args={"client_encoding": "utf8"}
        )
        
        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
        
        # Verificar tabelas criadas
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result]
            print(f"📋 Tabelas encontradas: {', '.join(tables)}")
            
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        return False

def insert_sample_data():
    """Insere dados de exemplo no novo banco"""
    print("\n🔄 Inserindo dados de exemplo...")
    
    try:
        from domcore.models.user import UserDB
        # Configuração de senhas
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Criar engine e sessão
        engine = create_engine(
            DATABASE_URL,
            echo=True,
            future=True,
            connect_args={"client_encoding": "utf8"}
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Limpar tabela antes de inserir exemplos
        db.query(UserDB).delete()
        db.commit()
        # Carregar fotos
        def load_photo(filename):
            path = os.path.join('Imagens_Logos', filename)
            if os.path.exists(path):
                with open(path, 'rb') as f:
                    return f.read()
            return None
        fotos = [load_photo(f'Foto{i}.png') for i in range(1, 5)]
        # Dados de exemplo com CPFs válidos e fotos
        sample_users = [
            {
                "id": str(uuid.uuid4()),
                "cpf": "12345678901",
                "nome": "Maria Empregadora",
                "email": "maria@empregadora.com",
                "celular": "11999999999",
                "perfil": "empregador",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "write"],
                "user_photo": fotos[0]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "98765432100",
                "nome": "Ana Empregada",
                "email": "ana@empregada.com",
                "celular": "11888888888",
                "perfil": "empregado",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web", "mobile"],
                "permissoes": ["read"],
                "user_photo": fotos[1]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "11122233344",
                "nome": "João Familiar",
                "email": "joao@familiar.com",
                "celular": "11777777777",
                "perfil": "familiar",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read"],
                "user_photo": fotos[2]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "55566677788",
                "nome": "Carlos Parceiro",
                "email": "carlos@parceiro.com",
                "celular": "11666666666",
                "perfil": "parceiro",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "write", "admin"],
                "user_photo": fotos[3]
            },
            {
                "id": str(uuid.uuid4()),
                "cpf": "59876913700",
                "nome": "Admin DOM",
                "email": "admin@dom.com",
                "celular": "11976487066",
                "perfil": "admin",
                "senha_hash": pwd_context.hash("123456"),
                "ativo": True,
                "plataformas": ["web"],
                "permissoes": ["read", "write", "admin", "system"],
                "user_photo": None
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
        if 'db' in locals():
            db.rollback()
            db.close()
        return False

def update_photo():
    """Atualiza a foto do usuário Ana"""
    from domcore.models.user import UserDB
    print("\n🖼️  Atualizando foto do usuário Ana...")
    
    try:
        # Caminho da imagem
        image_path = os.path.join('Imagens_Logos', 'Logo_Pessoas.png')
        
        if not os.path.exists(image_path):
            print(f"❌ Arquivo não encontrado: {image_path}")
            return False
        
        # Ler imagem
        with open(image_path, "rb") as f:
            photo_bytes = f.read()
        
        # Atualizar no banco
        engine = create_engine(
            DATABASE_URL,
            echo=True,
            future=True,
            connect_args={"client_encoding": "utf8"}
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Buscar usuário Ana
        user = db.query(UserDB).filter(UserDB.cpf == "98765432100").first()
        
        if user:
            user.user_photo = photo_bytes
            db.commit()
            print(f"✅ Foto atualizada para {user.nome}")
        else:
            print("❌ Usuário Ana não encontrado")
            return False
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro ao atualizar foto: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 Configurando novo banco de dados DOM v1")
    print("=" * 60)
    
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
    
    # Atualizar foto
    update_photo()
    
    print("\n" + "=" * 60)
    print("🎉 Configuração do novo banco concluída!")
    print("\n📋 Credenciais de teste:")
    print("  - Maria (Empregadora): 123.456.789-01 / 123456")
    print("  - Ana (Empregada): 987.654.321-00 / 123456")
    print("  - João (Familiar): 111.222.333-44 / 123456")
    print("  - Carlos (Parceiro): 555.666.777-88 / 123456")
    print("  - Admin: 999.888.777-66 / 123456")
    print("\n🔧 Configurações do banco:")
    print(f"  - Host: {DB_CONFIG['host']}")
    print(f"  - Porta: {DB_CONFIG['port']}")
    print(f"  - Banco: {DB_CONFIG['database']}")
    print(f"  - Usuário: {DB_CONFIG['username']}")
    print(f"  - Encoding: UTF-8")
    print(f"  - Collation: Portuguese_Brazil, 1252")

if __name__ == "__main__":
    main() 
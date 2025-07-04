"""
Script para adicionar coluna nickname na tabela users

@fileoverview Script de migração para adicionar campo nickname
@directory scripts
@description Adiciona coluna nickname na tabela users do banco de dados
@created 2024-12-19
@lastModified 2024-12-19
@author DOM Team
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from domcore.core.config import config

def add_nickname_column():
    """Adiciona a coluna nickname na tabela users"""
    try:
        # Criar conexão com o banco
        db_config = config.database
        database_url = f"postgresql://{db_config.username}:{db_config.password}@{db_config.host}:{db_config.port}/{db_config.database}?client_encoding=utf8"
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            # Verificar se a coluna já existe
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'nickname'
            """))
            
            if result.fetchone():
                print("✅ Coluna 'nickname' já existe na tabela 'users'")
                return
            
            # Adicionar a coluna nickname
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN nickname VARCHAR(50) NULL
            """))
            
            conn.commit()
            print("✅ Coluna 'nickname' adicionada com sucesso na tabela 'users'")
            
    except Exception as e:
        print(f"❌ Erro ao adicionar coluna 'nickname': {e}")
        raise

if __name__ == "__main__":
    print("🔄 Adicionando coluna 'nickname' na tabela 'users'...")
    add_nickname_column()
    print("✅ Migração concluída!") 
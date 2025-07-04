"""
@fileoverview Teste de conexão com banco de dados
@directory dom-v1
@description Script para testar conexão com PostgreSQL usando SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os

# Adicionar o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from domcore.core.config import config
from sqlalchemy import create_engine, text

def test_connection():
    """Testa a conexão com o banco de dados"""
    try:
        print("=== Teste de Conexão com Banco de Dados ===")
        print(f"Host: {config.database.host}")
        print(f"Port: {config.database.port}")
        print(f"Database: {config.database.database}")
        print(f"Username: {config.database.username}")
        print(f"Password: {'*' * len(config.database.password)}")
        
        # Criar string de conexão
        database_url = f"postgresql://{config.database.username}:{config.database.password}@{config.database.host}:{config.database.port}/{config.database.database}"
        print(f"\nString de conexão: {database_url.replace(config.database.password, '*' * len(config.database.password))}")
        
        # Configurações de encoding
        connect_args = {
            "client_encoding": "utf8",
            "options": "-c client_encoding=utf8",
            "connect_timeout": 10
        }
        
        print("\nCriando engine...")
        engine = create_engine(
            database_url,
            echo=True,
            future=True,
            connect_args=connect_args
        )
        
        print("Testando conexão...")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Conexão bem-sucedida!")
            print(f"PostgreSQL Version: {version}")
            
            # Testar query simples
            result = connection.execute(text("SELECT COUNT(*) FROM users"))
            count = result.fetchone()[0]
            print(f"Usuários na tabela: {count}")
            
        print("\n✅ Teste concluído com sucesso!")
        return True
        
    except Exception as e:
        print(f"\n❌ Erro na conexão: {type(e).__name__}: {str(e)}")
        print(f"Detalhes do erro: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1) 
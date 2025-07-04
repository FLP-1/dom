#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script para corrigir o tipo da coluna nickname
Altera a coluna de array para VARCHAR(100)
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Adicionar o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.core.config import config

def fix_nickname_column():
    """Corrige o tipo da coluna nickname"""
    
    # Definir senha do banco (substitua pela sua senha)
    db_password = "123456"  # ⚠️ ALTERE PARA SUA SENHA REAL
    
    # Criar engine do banco
    db_config = config.database
    database_url = f"postgresql://{db_config.username}:{db_password}@{db_config.host}:{db_config.port}/{db_config.database}"
    engine = create_engine(database_url)
    
    # SQL para corrigir a coluna
    sql_commands = [
        "ALTER TABLE users ALTER COLUMN nickname TYPE VARCHAR(100) USING nickname::VARCHAR(100);",
        "SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'nickname';"
    ]
    
    try:
        with engine.connect() as conn:
            print("Executando correção da coluna nickname...")
            
            # Executar a alteração
            conn.execute(text(sql_commands[0]))
            conn.commit()
            print("✅ Coluna nickname corrigida com sucesso!")
            
            # Verificar o resultado
            result = conn.execute(text(sql_commands[1]))
            row = result.fetchone()
            if row:
                print(f"✅ Verificação: {row[0]} - {row[1]} - {row[2]}")
            else:
                print("❌ Coluna não encontrada!")
                
    except Exception as e:
        print(f"❌ Erro ao corrigir coluna: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 Corrigindo tipo da coluna nickname...")
    print("⚠️  Certifique-se de alterar a senha no script se necessário!")
    success = fix_nickname_column()
    
    if success:
        print("\n🎉 Correção concluída! Agora você pode rodar o script de atualização.")
    else:
        print("\n❌ Falha na correção. Verifique o erro acima.") 
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script simples para corrigir a coluna nickname
"""

import psycopg2
import sys

def fix_nickname_column():
    """Corrige o tipo da coluna nickname"""
    
    # Configurações do banco
    db_config = {
        'host': 'localhost',
        'port': 5432,
        'database': 'dom_v1',
        'user': 'postgres',
        'password': '123456'  # ⚠️ ALTERE PARA SUA SENHA REAL
    }
    
    try:
        # Conectar ao banco
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        
        print("Executando correção da coluna nickname...")
        
        # Executar a alteração
        cursor.execute("ALTER TABLE users ALTER COLUMN nickname TYPE VARCHAR(100) USING nickname::VARCHAR(100);")
        conn.commit()
        print("✅ Coluna nickname corrigida com sucesso!")
        
        # Verificar o resultado
        cursor.execute("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'nickname';")
        row = cursor.fetchone()
        if row:
            print(f"✅ Verificação: {row[0]} - {row[1]} - {row[2]}")
        else:
            print("❌ Coluna não encontrada!")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro ao corrigir coluna: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Corrigindo tipo da coluna nickname...")
    print("⚠️  Certifique-se de alterar a senha no script se necessário!")
    success = fix_nickname_column()
    
    if success:
        print("\n🎉 Correção concluída! Agora você pode rodar o script de atualização.")
    else:
        print("\n❌ Falha na correção. Verifique o erro acima.") 
"""
Script para verificar dados existentes na tabela users
"""

from domcore.core.db import engine
from sqlalchemy import text

def check_existing_data():
    """Verifica se há dados importantes na tabela users"""
    
    with engine.connect() as conn:
        # Contar registros
        result = conn.execute(text("SELECT COUNT(*) as count FROM users"))
        total_records = result.fetchone()[0]
        
        print(f"=== DADOS EXISTENTES NA TABELA USERS ===")
        print(f"Total de registros: {total_records}")
        
        if total_records > 0:
            # Verificar alguns registros de exemplo
            result = conn.execute(text("""
                SELECT id, name, nickname, cpf, email, created_at 
                FROM users 
                LIMIT 5
            """))
            
            print(f"\n=== EXEMPLOS DE REGISTROS ===")
            for i, row in enumerate(result, 1):
                print(f"Registro {i}:")
                print(f"  ID: {row[0]}")
                print(f"  Name: {row[1]}")
                print(f"  Nickname: {row[2]}")
                print(f"  CPF: {row[3]}")
                print(f"  Email: {row[4]}")
                print(f"  Created: {row[5]}")
                print()
        
        # Verificar se há dados de produção (CPFs válidos, emails, etc.)
        if total_records > 0:
            result = conn.execute(text("""
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN cpf ~ '^[0-9]{11}$' THEN 1 END) as cpf_validos,
                    COUNT(CASE WHEN email LIKE '%@%' THEN 1 END) as emails_validos,
                    COUNT(CASE WHEN name IS NOT NULL AND name != '' THEN 1 END) as nomes_preenchidos
                FROM users
            """))
            
            stats = result.fetchone()
            print(f"=== ESTATÍSTICAS DOS DADOS ===")
            print(f"Total: {stats[0]}")
            print(f"CPFs válidos: {stats[1]}")
            print(f"Emails válidos: {stats[2]}")
            print(f"Nomes preenchidos: {stats[3]}")
            
            # Verificar se parece ser dados de produção ou teste
            if stats[1] > 0 and stats[2] > 0:
                print(f"\n⚠️  ATENÇÃO: Parece haver dados de produção na tabela!")
                print(f"   - {stats[1]} CPFs válidos")
                print(f"   - {stats[2]} emails válidos")
                return True
            else:
                print(f"\n✅ Parece ser dados de teste ou vazios")
                return False
        else:
            print(f"\n✅ Tabela vazia - pode ser alterada sem problemas")
            return False

if __name__ == "__main__":
    check_existing_data() 
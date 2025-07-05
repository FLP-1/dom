"""
Script para verificar senhas no banco de dados
"""

from domcore.core.db import engine
from sqlalchemy import text

def check_passwords():
    """Verifica como as senhas estão armazenadas"""
    
    with engine.connect() as conn:
        # Verificar alguns registros com senhas
        result = conn.execute(text("""
            SELECT id, nome, cpf, email, senha_hash 
            FROM users 
            LIMIT 3
        """))
        
        print("=== VERIFICAÇÃO DE SENHAS ===")
        for i, row in enumerate(result, 1):
            print(f"Registro {i}:")
            print(f"  ID: {row[0]}")
            print(f"  Nome: {row[1]}")
            print(f"  CPF: {row[2]}")
            print(f"  Email: {row[3]}")
            print(f"  Senha Hash: {row[4][:20]}..." if row[4] else "  Senha: NULL")
            print()

if __name__ == "__main__":
    check_passwords() 
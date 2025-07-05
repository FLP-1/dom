"""
Script para verificar a estrutura da tabela users
"""

from domcore.core.db import engine
from sqlalchemy import text

def check_table_structure():
    """Verifica a estrutura da tabela users"""
    with engine.connect() as conn:
        # Verificar campos da tabela users
        result = conn.execute(text("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """))
        
        print("=== CAMPOS NA TABELA USERS (BANCO DE DADOS) ===")
        db_fields = []
        for row in result:
            field_name = row[0]
            data_type = row[1]
            is_nullable = row[2]
            default_value = row[3]
            db_fields.append(field_name)
            print(f"  {field_name} ({data_type}) - Nullable: {is_nullable} - Default: {default_value}")
        
        print(f"\nTotal de campos no banco: {len(db_fields)}")
        print(f"Campos: {', '.join(db_fields)}")
        
        # Verificar se a tabela existe
        result = conn.execute(text("""
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_name = 'users'
        """))
        table_exists = result.fetchone()[0] > 0
        print(f"\nTabela 'users' existe: {table_exists}")
        
        return db_fields

if __name__ == "__main__":
    check_table_structure() 
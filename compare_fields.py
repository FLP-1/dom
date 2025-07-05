"""
Script para comparar campos do modelo Python com o banco de dados
"""

from domcore.core.db import engine
from sqlalchemy import text

def compare_fields():
    """Compara campos do modelo Python com o banco de dados"""
    
    # Campos do modelo Python (UserDB)
    python_fields = [
        'id', 'cpf', 'nome', 'nickname', 'email', 'celular', 'perfil', 
        'senha_hash', 'ativo', 'data_criacao', 'data_atualizacao', 
        'ultimo_login', 'plataformas', 'permissoes', 'user_photo'
    ]
    
    # Obter campos do banco de dados
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """))
        
        db_fields = [row[0] for row in result]
    
    print("=== COMPARAÇÃO DE CAMPOS ===")
    print(f"Total de campos no modelo Python: {len(python_fields)}")
    print(f"Total de campos no banco de dados: {len(db_fields)}")
    
    print("\n=== CAMPOS NO MODELO PYTHON ===")
    for i, field in enumerate(python_fields, 1):
        print(f"{i:2d}. {field}")
    
    print("\n=== CAMPOS NO BANCO DE DADOS ===")
    for i, field in enumerate(db_fields, 1):
        print(f"{i:2d}. {field}")
    
    print("\n=== DIFERENÇAS ===")
    
    # Campos que estão no Python mas não no banco
    missing_in_db = set(python_fields) - set(db_fields)
    if missing_in_db:
        print(f"❌ Campos no Python mas NÃO no banco ({len(missing_in_db)}):")
        for field in sorted(missing_in_db):
            print(f"   - {field}")
    
    # Campos que estão no banco mas não no Python
    missing_in_python = set(db_fields) - set(python_fields)
    if missing_in_python:
        print(f"❌ Campos no banco mas NÃO no Python ({len(missing_in_python)}):")
        for field in sorted(missing_in_python):
            print(f"   - {field}")
    
    # Campos com nomes diferentes
    different_names = []
    for py_field in python_fields:
        for db_field in db_fields:
            if py_field != db_field and (
                py_field in db_field or db_field in py_field or
                (py_field == 'nome' and db_field == 'name') or
                (py_field == 'senha_hash' and db_field == 'password') or
                (py_field == 'user_photo' and db_field == 'photo')
            ):
                different_names.append((py_field, db_field))
    
    if different_names:
        print(f"⚠️  Campos com nomes diferentes ({len(different_names)}):")
        for py_field, db_field in different_names:
            print(f"   - Python: '{py_field}' → Banco: '{db_field}'")
    
    # Campos que estão em ambos
    common_fields = set(python_fields) & set(db_fields)
    if common_fields:
        print(f"✅ Campos em ambos ({len(common_fields)}):")
        for field in sorted(common_fields):
            print(f"   - {field}")
    
    return {
        'python_fields': python_fields,
        'db_fields': db_fields,
        'missing_in_db': missing_in_db,
        'missing_in_python': missing_in_python,
        'different_names': different_names,
        'common_fields': common_fields
    }

if __name__ == "__main__":
    compare_fields() 
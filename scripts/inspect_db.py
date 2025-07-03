"""
@fileoverview Inspeção do banco de dados PostgreSQL
@directory scripts
@description Lista todas as tabelas e colunas do banco usando SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from sqlalchemy import inspect
from domcore.core.db import engine

if __name__ == "__main__":
    inspector = inspect(engine)
    print("Tabelas no banco de dados:")
    for table_name in inspector.get_table_names():
        print(f"\nTabela: {table_name}")
        columns = inspector.get_columns(table_name)
        for col in columns:
            print(f"  - {col['name']} ({col['type']})") 
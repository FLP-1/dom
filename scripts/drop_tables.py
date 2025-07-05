"""
Dropa todas as tabelas existentes do sistema DOM v1
@created 2024-12-19
@author DOM Team
"""
import os
from sqlalchemy import create_engine, text

# Configuração do banco
DATABASE_URL = "postgresql://postgres:FLP*2025@localhost:5432/db_dom"
engine = create_engine(DATABASE_URL)

# SQL para dropar as tabelas
drop_tables_sql = """
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_group_roles CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;
"""

print('Dropando tabelas existentes...')
with engine.connect() as conn:
    conn.execute(text(drop_tables_sql))
    conn.commit()
print('Tabelas dropadas com sucesso!') 
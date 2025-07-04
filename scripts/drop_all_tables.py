"""
@fileoverview Dropa todas as tabelas do banco PostgreSQL
@directory scripts
@description Remove todas as tabelas do schema public usando SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sqlalchemy import create_engine, text
from domcore.core.config import config

def get_engine():
    db_config = config.database
    database_url = f"postgresql://{db_config.username}:{db_config.password}@{db_config.host}:{db_config.port}/{db_config.database}?client_encoding=utf8"
    return create_engine(database_url, connect_args={"client_encoding": "utf8"})

if __name__ == "__main__":
    engine = get_engine()
    with engine.connect() as conn:
        print("Dropando todas as tabelas do schema public...")
        conn.execute(text("""
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
                END LOOP;
            END $$;
        """))
        print("Todas as tabelas foram removidas.") 
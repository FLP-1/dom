"""
@fileoverview Dropa todas as tabelas do banco PostgreSQL
@directory scripts
@description Remove todas as tabelas do schema public usando SQLAlchemy
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from sqlalchemy import text
from domcore.core.db import engine

if __name__ == "__main__":
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
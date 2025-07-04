#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Remove índice único do campo email na tabela users
@fileoverview Script para remover índice único do email
@directory scripts
@description Remove índice único do campo email na tabela users do PostgreSQL
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from sqlalchemy import create_engine, text
from domcore.core.config import config

def remove_email_unique_index():
    db_config = config.database
    database_url = f"postgresql://{db_config.username}:{db_config.password}@{db_config.host}:{db_config.port}/{db_config.database}?client_encoding=utf8"
    engine = create_engine(database_url)
    with engine.connect() as conn:
        print("Removendo índice único do campo email...")
        conn.execute(text("DROP INDEX IF EXISTS ix_users_email;"))
        conn.commit()
        print("✅ Índice removido com sucesso!")

if __name__ == "__main__":
    remove_email_unique_index() 
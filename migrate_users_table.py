"""
Script de migração para alinhar a tabela users com o modelo Python
Mantém todos os dados existentes e adiciona campos faltantes
"""

from domcore.core.db import engine
from sqlalchemy import text
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_users_table():
    """Migra a tabela users para alinhar com o modelo Python"""
    
    migration_steps = [
        # 1. Adicionar campos faltantes
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS celular VARCHAR(20)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS perfil VARCHAR(20) DEFAULT 'empregador'",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS plataformas JSON DEFAULT '[]'",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS permissoes JSON DEFAULT '[]'",
        
        # 2. Renomear campos existentes
        "ALTER TABLE users RENAME COLUMN name TO nome",
        "ALTER TABLE users RENAME COLUMN password TO senha_hash", 
        "ALTER TABLE users RENAME COLUMN photo TO user_photo",
        "ALTER TABLE users RENAME COLUMN created_at TO data_criacao",
        "ALTER TABLE users RENAME COLUMN updated_at TO data_atualizacao",
        
        # 3. Ajustar constraints e tipos
        "ALTER TABLE users ALTER COLUMN nickname DROP NOT NULL",
        "ALTER TABLE users ALTER COLUMN user_photo DROP NOT NULL",
        "ALTER TABLE users ALTER COLUMN nome SET NOT NULL",
        "ALTER TABLE users ALTER COLUMN senha_hash SET NOT NULL",
        
        # 4. Adicionar índices se necessário
        "CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf)",
        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
        "CREATE INDEX IF NOT EXISTS idx_users_ativo ON users(ativo)",
    ]
    
    rollback_steps = [
        # Rollback: reverter renomeações
        "ALTER TABLE users RENAME COLUMN nome TO name",
        "ALTER TABLE users RENAME COLUMN senha_hash TO password",
        "ALTER TABLE users RENAME COLUMN user_photo TO photo", 
        "ALTER TABLE users RENAME COLUMN data_criacao TO created_at",
        "ALTER TABLE users RENAME COLUMN data_atualizacao TO updated_at",
        
        # Rollback: remover campos adicionados
        "ALTER TABLE users DROP COLUMN IF EXISTS celular",
        "ALTER TABLE users DROP COLUMN IF EXISTS perfil",
        "ALTER TABLE users DROP COLUMN IF EXISTS ativo",
        "ALTER TABLE users DROP COLUMN IF EXISTS ultimo_login",
        "ALTER TABLE users DROP COLUMN IF EXISTS plataformas",
        "ALTER TABLE users DROP COLUMN IF EXISTS permissoes",
    ]
    
    try:
        logger.info("🔄 Iniciando migração da tabela users...")
        
        with engine.connect() as conn:
            # Verificar estado atual
            logger.info("📊 Verificando estado atual da tabela...")
            result = conn.execute(text("SELECT COUNT(*) FROM users"))
            total_records = result.fetchone()[0]
            logger.info(f"   - Total de registros: {total_records}")
            
            # Executar migração
            logger.info("🔧 Executando passos da migração...")
            for i, step in enumerate(migration_steps, 1):
                try:
                    logger.info(f"   Passo {i}: {step}")
                    conn.execute(text(step))
                    conn.commit()
                    logger.info(f"   ✅ Passo {i} executado com sucesso")
                except Exception as e:
                    logger.warning(f"   ⚠️  Passo {i} falhou (pode já estar aplicado): {e}")
                    conn.rollback()
            
            # Verificar resultado
            logger.info("🔍 Verificando resultado da migração...")
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                ORDER BY ordinal_position
            """))
            
            new_columns = [row[0] for row in result]
            logger.info(f"   - Novos campos: {', '.join(new_columns)}")
            
            # Verificar se os dados foram preservados
            result = conn.execute(text("SELECT COUNT(*) FROM users"))
            final_records = result.fetchone()[0]
            logger.info(f"   - Registros após migração: {final_records}")
            
            if final_records == total_records:
                logger.info("✅ Migração concluída com sucesso! Todos os dados foram preservados.")
            else:
                logger.error(f"❌ ERRO: Perda de dados! Antes: {total_records}, Depois: {final_records}")
                return False
                
        return True
        
    except Exception as e:
        logger.error(f"❌ Erro durante migração: {e}")
        logger.info("🔄 Tentando rollback...")
        
        try:
            with engine.connect() as conn:
                for step in rollback_steps:
                    try:
                        conn.execute(text(step))
                        conn.commit()
                    except Exception as rollback_error:
                        logger.warning(f"Rollback step falhou: {rollback_error}")
                        conn.rollback()
            
            logger.info("✅ Rollback concluído")
        except Exception as rollback_error:
            logger.error(f"❌ Erro no rollback: {rollback_error}")
        
        return False

def verify_migration():
    """Verifica se a migração foi bem-sucedida"""
    
    expected_columns = [
        'id', 'cpf', 'nome', 'nickname', 'email', 'celular', 'perfil',
        'senha_hash', 'ativo', 'data_criacao', 'data_atualizacao',
        'ultimo_login', 'plataformas', 'permissoes', 'user_photo'
    ]
    
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """))
        
        actual_columns = [row[0] for row in result]
        
        print("=== VERIFICAÇÃO DA MIGRAÇÃO ===")
        print(f"Campos esperados: {len(expected_columns)}")
        print(f"Campos encontrados: {len(actual_columns)}")
        
        missing = set(expected_columns) - set(actual_columns)
        extra = set(actual_columns) - set(expected_columns)
        
        if missing:
            print(f"❌ Campos faltando: {missing}")
        if extra:
            print(f"⚠️  Campos extras: {extra}")
        if not missing and not extra:
            print("✅ Migração bem-sucedida! Todos os campos estão corretos.")
            return True
        
        return False

if __name__ == "__main__":
    print("=== MIGRAÇÃO DA TABELA USERS ===")
    print("Este script irá:")
    print("1. Adicionar campos faltantes")
    print("2. Renomear campos existentes") 
    print("3. Preservar todos os dados")
    print("4. Verificar o resultado")
    print()
    
    # Executar migração
    success = migrate_users_table()
    
    if success:
        print("\n=== VERIFICAÇÃO FINAL ===")
        verify_migration()
    else:
        print("\n❌ Migração falhou!") 
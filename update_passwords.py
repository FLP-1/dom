"""
Script para atualizar senhas com hashes bcrypt válidos
"""

from domcore.core.db import engine
from sqlalchemy import text
from passlib.context import CryptContext
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_passwords():
    """Atualiza senhas com hashes bcrypt válidos"""
    
    # Senha padrão para todos os usuários
    default_password = "123456"
    hashed_password = pwd_context.hash(default_password)
    
    logger.info(f"🔄 Atualizando senhas...")
    logger.info(f"   Senha padrão: {default_password}")
    logger.info(f"   Hash gerado: {hashed_password[:20]}...")
    
    with engine.connect() as conn:
        # Atualizar todas as senhas
        result = conn.execute(text("""
            UPDATE users 
            SET senha_hash = :hashed_password
            WHERE senha_hash = 'senha_hash' OR senha_hash IS NULL
        """), {"hashed_password": hashed_password})
        
        updated_count = result.rowcount
        conn.commit()
        
        logger.info(f"✅ {updated_count} senhas atualizadas")
        
        # Verificar resultado
        result = conn.execute(text("SELECT COUNT(*) FROM users"))
        total_users = result.fetchone()[0]
        
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM users 
            WHERE senha_hash != 'senha_hash' AND senha_hash IS NOT NULL
        """))
        valid_passwords = result.fetchone()[0]
        
        logger.info(f"📊 Total de usuários: {total_users}")
        logger.info(f"📊 Senhas válidas: {valid_passwords}")
        
        if valid_passwords == total_users:
            logger.info("✅ Todas as senhas foram atualizadas com sucesso!")
            return True
        else:
            logger.error(f"❌ Erro: {total_users - valid_passwords} senhas ainda inválidas")
            return False

def test_login():
    """Testa login com a senha padrão"""
    
    from main import get_user_by_cpf, verify_password
    from sqlalchemy.orm import Session
    
    test_cpf = "38358550421"
    test_password = "123456"
    
    logger.info(f"🧪 Testando login...")
    logger.info(f"   CPF: {test_cpf}")
    logger.info(f"   Senha: {test_password}")
    
    with engine.connect() as conn:
        # Buscar usuário
        result = conn.execute(text("""
            SELECT id, nome, cpf, senha_hash 
            FROM users 
            WHERE cpf = :cpf
        """), {"cpf": test_cpf})
        
        user = result.fetchone()
        
        if user:
            logger.info(f"   Usuário encontrado: {user[1]}")
            
            # Verificar senha
            if verify_password(test_password, user[3]):
                logger.info("✅ Login funcionando corretamente!")
                return True
            else:
                logger.error("❌ Senha incorreta!")
                return False
        else:
            logger.error(f"❌ Usuário não encontrado: {test_cpf}")
            return False

if __name__ == "__main__":
    print("=== ATUALIZAÇÃO DE SENHAS ===")
    
    # Atualizar senhas
    success = update_passwords()
    
    if success:
        print("\n=== TESTE DE LOGIN ===")
        test_login()
        
        print(f"\n📋 RESUMO:")
        print(f"   - Senha padrão: 123456")
        print(f"   - Use qualquer CPF da lista para testar")
        print(f"   - Exemplo: 38358550421")
    else:
        print("\n❌ Falha na atualização de senhas!") 
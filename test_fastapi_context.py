"""
@fileoverview Teste de contexto FastAPI
@directory dom-v1
@description Teste que simula o contexto do FastAPI para identificar problemas de encoding
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os

# Simular o contexto do FastAPI
sys.path.append('domcore')

# Importar exatamente como no main.py
from domcore.core.db import SessionLocal, engine
from domcore.models.user import UserDB

def test_fastapi_context():
    """Testa o contexto do FastAPI"""
    try:
        print("=== Teste de Contexto FastAPI ===")
        
        # Testar SessionLocal (como no get_db())
        print("Testando SessionLocal...")
        db = SessionLocal()
        
        try:
            # Testar query como no get_user_by_cpf()
            print("Executando query como no FastAPI...")
            user = db.query(UserDB).filter(UserDB.cpf == "12345678901", UserDB.ativo == True).first()
            
            if user:
                print(f"✅ Usuário encontrado: {user.nome}")
            else:
                print("ℹ️ Usuário não encontrado (esperado para CPF de teste)")
                
        finally:
            db.close()
            
        print("\n✅ Teste do contexto FastAPI concluído com sucesso!")
        return True
        
    except Exception as e:
        print(f"\n❌ Erro no contexto FastAPI: {type(e).__name__}: {str(e)}")
        print(f"Detalhes do erro: {e}")
        return False

if __name__ == "__main__":
    success = test_fastapi_context()
    sys.exit(0 if success else 1) 
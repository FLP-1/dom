"""
Verificar Usuários na Base - DOM v1

@fileoverview Script para verificar usuários na base
@directory .
@description Lista todos os usuários cadastrados
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
sys.path.append('domcore')

from domcore.core.db import SessionLocal
from domcore.models.user import UserDB

def check_users():
    """Verifica usuários na base de dados"""
    print("🔍 Verificando usuários na base de dados...")
    
    try:
        db = SessionLocal()
        users = db.query(UserDB).filter(UserDB.ativo == True).all()
        
        print(f"\n📋 Total de usuários ativos: {len(users)}")
        print("\n👥 Usuários cadastrados:")
        print("-" * 80)
        print(f"{'CPF':<15} {'Nome':<25} {'Email':<25} {'Perfil':<12}")
        print("-" * 80)
        
        for user in users:
            print(f"{user.cpf:<15} {user.nome:<25} {user.email or 'N/A':<25} {user.perfil:<12}")
        
        print("-" * 80)
        
        # Mostrar CPFs para teste
        print("\n🔑 CPFs disponíveis para teste:")
        for user in users:
            print(f"  - {user.cpf} ({user.nome}) - {user.perfil}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Erro ao verificar usuários: {e}")

if __name__ == "__main__":
    check_users() 
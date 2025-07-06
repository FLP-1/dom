"""
Script para debugar estrutura dos dados de usuários

@fileoverview Script de debug de usuários do DOM v1
@directory scripts
@description Script para verificar a estrutura dos dados retornados pelo UserService
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
import json

# Adiciona o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.services.user_service import UserService
from domcore.core.db import SessionLocal

def debug_users():
    """Debuga a estrutura dos dados de usuários"""
    
    print("🔍 Debugando estrutura dos dados de usuários...")
    
    try:
        # Busca usuários
        db = SessionLocal()
        users_data = UserService.get_users(db)
        users = users_data["items"]
        
        print(f"📋 Encontrados {len(users)} usuários")
        
        if users:
            # Mostra o primeiro usuário como exemplo
            first_user = users[0]
            print(f"\n📝 Estrutura do primeiro usuário:")
            print(f"Tipo: {type(first_user)}")
            print(f"Chaves disponíveis: {list(first_user.keys())}")
            print(f"Dados completos:")
            print(json.dumps(first_user, indent=2, default=str))
            
            # Mostra alguns usuários diferentes
            print(f"\n📝 Amostra de usuários:")
            for i, user in enumerate(users[:3]):
                print(f"Usuário {i+1}:")
                print(f"  ID: {user.get('id', 'N/A')}")
                print(f"  Nome: {user.get('nome', 'N/A')}")
                print(f"  Name: {user.get('name', 'N/A')}")
                print(f"  Perfil: {user.get('perfil', 'N/A')}")
                print(f"  Profile: {user.get('profile', 'N/A')}")
                print()
        
    except Exception as e:
        print(f"❌ Erro durante debug: {e}")
        raise

if __name__ == "__main__":
    debug_users() 
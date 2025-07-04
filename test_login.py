"""
@fileoverview Teste de login com dados válidos
@directory dom-v1
@description Script para testar login com dados reais do banco
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import requests
import json

def test_login():
    """Testa o login com dados válidos"""
    try:
        print("=== Teste de Login ===")
        
        # URL do backend
        url = "http://localhost:8000/api/auth/login"
        
        # Dados de teste (usando um dos usuários criados no setup)
        login_data = {
            "cpf": "303.617.927-51",  # Maria Empregadora
            "password": "123456",
            "profile": "empregador"
        }
        
        print(f"Tentando login com CPF: {login_data['cpf']}")
        
        # Fazer requisição
        response = requests.post(url, json=login_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login bem-sucedido!")
            print(f"Usuário: {data.get('name')}")
            print(f"Perfil: {data.get('profile')}")
            print(f"Token: {data.get('access_token')[:20]}...")
            print(f"Foto: {'Sim' if data.get('photo') else 'Não'}")
        else:
            print("❌ Login falhou")
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        return False

if __name__ == "__main__":
    success = test_login()
    exit(0 if success else 1) 
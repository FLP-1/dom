#!/usr/bin/env python3
"""
Script de teste para verificar endpoints

@fileoverview Script de teste dos endpoints
@directory .
@description Testa os endpoints principais do sistema
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import requests
import json
import sys

def test_backend_endpoints():
    """Testa endpoints do backend Python"""
    base_url = "http://localhost:8000"
    
    print("🔍 Testando endpoints do backend...")
    
    # Teste 1: Endpoint de login
    print("\n1. Testando /api/auth/login...")
    try:
        login_data = {
            "cpf": "12345678901",
            "password": "123456"
        }
        response = requests.post(f"{base_url}/api/auth/login", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login bem-sucedido para: {data.get('name', 'N/A')}")
            token = data.get('access_token')
            return token
        else:
            print(f"   ❌ Erro no login: {response.text}")
            return None
    except Exception as e:
        print(f"   ❌ Erro de conexão: {e}")
        return None

def test_frontend_endpoints(token):
    """Testa endpoints do frontend Next.js"""
    base_url = "http://localhost:3000"
    
    print("\n🔍 Testando endpoints do frontend...")
    
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # Teste 1: Endpoint de contexts
    print("\n1. Testando /api/auth/contexts...")
    try:
        response = requests.get(f"{base_url}/api/auth/contexts", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Contexts retornados: {len(data.get('contexts', []))} contextos")
        else:
            print(f"   ❌ Erro: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro de conexão: {e}")
    
    # Teste 2: Endpoint de dashboard stats
    print("\n2. Testando /api/dashboard/stats...")
    try:
        response = requests.get(f"{base_url}/api/dashboard/stats?profile=empregador&user_id=user_123")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Stats retornados para perfil: {data.get('profile', 'N/A')}")
            print(f"   📊 Tarefas totais: {data.get('task_stats', {}).get('total_tarefas', 'N/A')}")
        else:
            print(f"   ❌ Erro: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro de conexão: {e}")

def test_python_script():
    """Testa o script Python diretamente"""
    print("\n🔍 Testando script Python get_dashboard_stats.py...")
    try:
        import subprocess
        result = subprocess.run(
            ["python", "domcore/get_dashboard_stats.py", "empregador", "user_123"],
            capture_output=True,
            text=True,
            cwd="."
        )
        
        print(f"   Exit code: {result.returncode}")
        if result.returncode == 0:
            try:
                data = json.loads(result.stdout)
                print(f"   ✅ Script executado com sucesso")
                print(f"   📊 Perfil: {data.get('profile', 'N/A')}")
                print(f"   📊 Tarefas: {data.get('task_stats', {}).get('total_tarefas', 'N/A')}")
            except json.JSONDecodeError as e:
                print(f"   ❌ Erro no JSON: {e}")
                print(f"   Output: {result.stdout[:200]}...")
        else:
            print(f"   ❌ Erro no script: {result.stderr}")
    except Exception as e:
        print(f"   ❌ Erro ao executar script: {e}")

def main():
    """Função principal"""
    print("🚀 Iniciando testes dos endpoints...")
    
    # Testa script Python primeiro
    test_python_script()
    
    # Testa backend
    token = test_backend_endpoints()
    
    # Testa frontend
    test_frontend_endpoints(token)
    
    print("\n✅ Testes concluídos!")

if __name__ == "__main__":
    main() 
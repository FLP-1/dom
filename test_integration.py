"""
Teste de Integração Frontend-Backend - DOM v1

@fileoverview Script de teste para integração completa
@directory .
@description Testa o fluxo completo de tarefas com dados reais
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configurações
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_health():
    """Testa se o backend está rodando"""
    print("🔍 Testando saúde do backend...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health")
        if response.status_code == 200:
            print("✅ Backend está rodando")
            return True
        else:
            print(f"❌ Backend retornou status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro ao conectar com backend: {e}")
        return False

def test_frontend_health():
    """Testa se o frontend está rodando"""
    print("🔍 Testando saúde do frontend...")
    try:
        response = requests.get(f"{FRONTEND_URL}")
        if response.status_code == 200:
            print("✅ Frontend está rodando")
            return True
        else:
            print(f"❌ Frontend retornou status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro ao conectar com frontend: {e}")
        return False

def test_login_and_tasks():
    """Testa login e operações de tarefas"""
    print("\n🧪 Testando fluxo completo de tarefas...")
    
    # Login
    login_data = {
        "cpf": "59876913700",
        "password": "123456"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Login falhou: {response.status_code}")
            return False
        
        user_data = response.json()
        token = user_data['access_token']
        print(f"✅ Login bem-sucedido: {user_data['name']} ({user_data['profile']})")
        
        # Testar criação de tarefa
        print("\n📝 Testando criação de tarefa...")
        task_data = {
            "titulo": "Teste de Integração",
            "descricao": "Tarefa criada via teste de integração",
            "prioridade": 2,
            "categoria": "teste",
            "tags": ["integração", "teste"]
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BACKEND_URL}/api/tasks", json=task_data, headers=headers)
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Tarefa criada: {task['id']} - {task['titulo']}")
            task_id = task['id']
        else:
            print(f"❌ Erro ao criar tarefa: {response.status_code} - {response.text}")
            return False
        
        # Testar listagem de tarefas
        print("\n📋 Testando listagem de tarefas...")
        response = requests.get(f"{BACKEND_URL}/api/tasks", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Tarefas encontradas: {data['total']}")
            for task in data['tasks']:
                print(f"  - {task['titulo']} ({task['status']})")
        else:
            print(f"❌ Erro ao listar tarefas: {response.status_code}")
            return False
        
        # Testar estatísticas
        print("\n📊 Testando estatísticas...")
        response = requests.get(f"{BACKEND_URL}/api/tasks/stats", headers=headers)
        
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Estatísticas obtidas:")
            print(f"  - Total: {stats['total_tarefas']}")
            print(f"  - Pendentes: {stats['tarefas_pendentes']}")
            print(f"  - Em andamento: {stats['tarefas_em_andamento']}")
            print(f"  - Concluídas: {stats['tarefas_concluidas']}")
        else:
            print(f"❌ Erro ao obter estatísticas: {response.status_code}")
            return False
        
        # Testar atualização de status
        print("\n🔄 Testando atualização de status...")
        response = requests.patch(f"{BACKEND_URL}/api/tasks/{task_id}/status?status=in_progress", headers=headers)
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Status atualizado: {task['status']}")
        else:
            print(f"❌ Erro ao atualizar status: {response.status_code}")
            return False
        
        # Testar remoção
        print("\n🗑️ Testando remoção de tarefa...")
        response = requests.delete(f"{BACKEND_URL}/api/tasks/{task_id}", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Tarefa removida: {result['message']}")
        else:
            print(f"❌ Erro ao remover tarefa: {response.status_code}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        return False

def main():
    """Função principal de teste"""
    print("🧪 TESTE DE INTEGRAÇÃO FRONTEND-BACKEND - DOM v1")
    print("=" * 60)
    
    # Testar saúde dos serviços
    backend_ok = test_backend_health()
    frontend_ok = test_frontend_health()
    
    if not backend_ok:
        print("\n❌ Backend não está rodando. Execute: python main.py")
        return
    
    if not frontend_ok:
        print("\n⚠️ Frontend não está rodando. Execute: cd frontend && npm run dev")
        print("Continuando apenas com testes do backend...")
    
    # Testar fluxo completo
    success = test_login_and_tasks()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 TESTE DE INTEGRAÇÃO CONCLUÍDO COM SUCESSO!")
        print("\n✅ Backend de tarefas funcionando perfeitamente")
        print("✅ Endpoints testados e validados")
        print("✅ Fluxo CRUD completo operacional")
        if frontend_ok:
            print("✅ Frontend integrado e pronto para uso")
        else:
            print("⚠️ Frontend precisa ser iniciado para teste completo")
    else:
        print("❌ TESTE FALHOU - Verifique os logs acima")
    
    print("\n📋 Próximos passos:")
    print("1. Acesse http://localhost:3000 para testar o frontend")
    print("2. Faça login com CPF: 59876913700, Senha: 123456")
    print("3. Navegue para a página de tarefas")
    print("4. Verifique se os dados reais aparecem")

if __name__ == "__main__":
    main() 
"""
Teste dos Endpoints de Tarefas - DOM v1

@fileoverview Script de teste para endpoints de tarefas
@directory .
@description Testa todos os endpoints de tarefas criados
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import requests
import json
from datetime import datetime, timedelta

# Configurações
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
TASKS_URL = f"{BASE_URL}/api/tasks"

# Credenciais de teste
TEST_USERS = [
    {
        "name": "Maria (Empregadora)",
        "cpf": "12345678901",
        "password": "123456"
    },
    {
        "name": "Ana (Empregada)", 
        "cpf": "98765432100",
        "password": "123456"
    }
]

def login_user(cpf: str, password: str) -> str:
    """Faz login e retorna o token"""
    try:
        response = requests.post(LOGIN_URL, json={
            "cpf": cpf,
            "password": password
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login bem-sucedido: {data['name']} ({data['profile']})")
            return data['access_token']
        else:
            print(f"❌ Erro no login: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return None

def test_create_task(token: str, user_name: str):
    """Testa criação de tarefa"""
    print(f"\n🔄 Testando criação de tarefa para {user_name}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    task_data = {
        "titulo": "Limpar a casa",
        "descricao": "Limpeza geral incluindo quartos, banheiros e cozinha",
        "prioridade": 2,
        "data_limite": (datetime.now() + timedelta(days=1)).isoformat(),
        "categoria": "limpeza",
        "tags": ["casa", "limpeza", "semanal"]
    }
    
    try:
        response = requests.post(TASKS_URL, json=task_data, headers=headers)
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Tarefa criada: {task['id']} - {task['titulo']}")
            return task['id']
        else:
            print(f"❌ Erro ao criar tarefa: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return None

def test_get_tasks(token: str):
    """Testa listagem de tarefas"""
    print(f"\n🔄 Testando listagem de tarefas...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(TASKS_URL, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Tarefas encontradas: {data['total']}")
            for task in data['tasks']:
                print(f"  - {task['titulo']} ({task['status']})")
            return data['tasks']
        else:
            print(f"❌ Erro ao listar tarefas: {response.status_code} - {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return []

def test_get_task(token: str, task_id: str):
    """Testa busca de tarefa específica"""
    print(f"\n🔄 Testando busca da tarefa {task_id}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{TASKS_URL}/{task_id}", headers=headers)
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Tarefa encontrada: {task['titulo']}")
            return task
        else:
            print(f"❌ Erro ao buscar tarefa: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return None

def test_update_task(token: str, task_id: str):
    """Testa atualização de tarefa"""
    print(f"\n🔄 Testando atualização da tarefa {task_id}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "titulo": "Limpar a casa - URGENTE",
        "prioridade": 3,
        "descricao": "Limpeza geral urgente incluindo quartos, banheiros e cozinha"
    }
    
    try:
        response = requests.put(f"{TASKS_URL}/{task_id}", json=update_data, headers=headers)
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Tarefa atualizada: {task['titulo']} (prioridade: {task['prioridade']})")
            return task
        else:
            print(f"❌ Erro ao atualizar tarefa: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return None

def test_update_task_status(token: str, task_id: str):
    """Testa atualização de status da tarefa"""
    print(f"\n🔄 Testando atualização de status da tarefa {task_id}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.patch(f"{TASKS_URL}/{task_id}/status?status=in_progress", headers=headers)
        
        if response.status_code == 200:
            task = response.json()
            print(f"✅ Status atualizado: {task['status']}")
            return task
        else:
            print(f"❌ Erro ao atualizar status: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return None

def test_get_task_stats(token: str):
    """Testa estatísticas de tarefas"""
    print(f"\n🔄 Testando estatísticas de tarefas...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{TASKS_URL}/stats", headers=headers)
        
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Estatísticas:")
            print(f"  - Total: {stats['total_tarefas']}")
            print(f"  - Pendentes: {stats['tarefas_pendentes']}")
            print(f"  - Em andamento: {stats['tarefas_em_andamento']}")
            print(f"  - Concluídas: {stats['tarefas_concluidas']}")
            print(f"  - Atrasadas: {stats['tarefas_atrasadas']}")
            print(f"  - Para hoje: {stats['tarefas_hoje']}")
            print(f"  - Da semana: {stats['tarefas_semana']}")
            return stats
        else:
            print(f"❌ Erro ao obter estatísticas: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return None

def test_delete_task(token: str, task_id: str):
    """Testa remoção de tarefa"""
    print(f"\n🔄 Testando remoção da tarefa {task_id}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.delete(f"{TASKS_URL}/{task_id}", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Tarefa removida: {result['message']}")
            return True
        else:
            print(f"❌ Erro ao remover tarefa: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return False

def main():
    """Função principal de teste"""
    print("🧪 TESTE DOS ENDPOINTS DE TAREFAS - DOM v1")
    print("=" * 50)
    
    # Testar com usuário empregador (pode criar tarefas)
    user = TEST_USERS[0]
    print(f"\n👤 Testando com: {user['name']}")
    
    # Login
    token = login_user(user['cpf'], user['password'])
    if not token:
        print("❌ Falha no login. Abortando testes.")
        return
    
    # Testar criação
    task_id = test_create_task(token, user['name'])
    if not task_id:
        print("❌ Falha na criação. Abortando testes.")
        return
    
    # Testar listagem
    tasks = test_get_tasks(token)
    
    # Testar busca específica
    task = test_get_task(token, task_id)
    
    # Testar atualização
    updated_task = test_update_task(token, task_id)
    
    # Testar atualização de status
    status_task = test_update_task_status(token, task_id)
    
    # Testar estatísticas
    stats = test_get_task_stats(token)
    
    # Testar remoção
    deleted = test_delete_task(token, task_id)
    
    print("\n" + "=" * 50)
    print("🎉 TESTES CONCLUÍDOS!")
    
    if all([task_id, tasks, task, updated_task, status_task, stats, deleted]):
        print("✅ Todos os testes passaram!")
    else:
        print("⚠️  Alguns testes falharam. Verifique os logs acima.")

if __name__ == "__main__":
    main() 
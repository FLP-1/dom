import requests
import json

# Teste rápido
print("🧪 Teste Rápido - Endpoints de Tarefas")

# 1. Login
print("\n1. Testando login...")
login_data = {
    "cpf": "59876913700",
    "password": "123456"
}

response = requests.post("http://localhost:8000/api/auth/login", json=login_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    token = data['access_token']
    print(f"✅ Login OK: {data['name']} ({data['profile']})")
else:
    print(f"❌ Login falhou: {response.text}")
    exit()

# 2. Criar tarefa
print("\n2. Testando criação de tarefa...")
headers = {"Authorization": f"Bearer {token}"}
task_data = {
    "titulo": "Teste de Tarefa",
    "descricao": "Tarefa criada via teste",
    "prioridade": 2,
    "categoria": "teste"
}

response = requests.post("http://localhost:8000/api/tasks", json=task_data, headers=headers)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    task = response.json()
    task_id = task['id']
    print(f"✅ Tarefa criada: {task_id}")
else:
    print(f"❌ Criação falhou: {response.text}")
    exit()

# 3. Listar tarefas
print("\n3. Testando listagem...")
response = requests.get("http://localhost:8000/api/tasks", headers=headers)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Tarefas encontradas: {data['total']}")
else:
    print(f"❌ Listagem falhou: {response.text}")

# 4. Estatísticas
print("\n4. Testando estatísticas...")
response = requests.get("http://localhost:8000/api/tasks/stats", headers=headers)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    stats = response.json()
    print(f"✅ Estatísticas: {stats['total_tarefas']} tarefas")
else:
    print(f"❌ Estatísticas falharam: {response.text}")

print("\n�� Teste concluído!") 
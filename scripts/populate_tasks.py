"""
@fileoverview Script para popular a tabela de tarefas com massa de teste realista
@directory scripts
@description Insere tarefas variadas para diferentes perfis, status, prioridades, datas, categorias e responsáveis
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import os
import sys
from datetime import datetime, timedelta
import random
from uuid import uuid4

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from domcore.core.db import SessionLocal, engine
from domcore.models.user import UserDB
from domcore.models.task import TaskDB, TaskStatus

# Categorias e tags de exemplo
CATEGORIAS = ["limpeza", "cozinha", "compras", "administração", "manutenção", "cuidado", "financeiro", "agenda", "outros"]
TAGS = ["urgente", "diário", "mensal", "importante", "fácil", "rápido", "prioridade", "recorrente", "extra"]

# Status possíveis
STATUS = [
    TaskStatus.PENDING,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETED,
    TaskStatus.CANCELLED,
    TaskStatus.OVERDUE
]

# Prioridades possíveis
PRIORIDADES = [1, 2, 3]

# Quantidade de tarefas a criar
N_TAREFAS = 30

# Função para gerar datas variadas
now = datetime.now()
def random_date(days_back=30):
    return now - timedelta(days=random.randint(0, days_back))

def main():
    db = SessionLocal()
    try:
        print("🔍 Buscando usuários existentes...")
        users = db.query(UserDB).filter(UserDB.ativo == True).all()
        if not users:
            print("❌ Nenhum usuário ativo encontrado. Cadastre usuários antes de rodar este script.")
            return
        print(f"✅ {len(users)} usuários encontrados.")
        
        print(f"📝 Gerando {N_TAREFAS} tarefas de teste...")
        for i in range(N_TAREFAS):
            criador = random.choice(users)
            responsavel = random.choice(users)
            status = random.choice(STATUS)
            prioridade = random.choice(PRIORIDADES)
            categoria = random.choice(CATEGORIAS)
            tags = random.sample(TAGS, k=random.randint(1, 3))
            data_criacao = random_date()
            data_conclusao = None
            if status == TaskStatus.COMPLETED:
                data_conclusao = data_criacao + timedelta(days=random.randint(1, 10))
            elif status == TaskStatus.OVERDUE:
                data_conclusao = data_criacao - timedelta(days=random.randint(1, 5))
            titulo = f"Tarefa {i+1} - {categoria.capitalize()}"
            descricao = f"{titulo} gerada para testes automáticos."
            
            tarefa = TaskDB(
                id=f"task_{uuid4().hex[:12]}",
                titulo=titulo,
                descricao=descricao,
                prioridade=prioridade,
                categoria=categoria,
                tags=tags,
                status=status,
                criador_id=criador.id,
                responsavel_id=responsavel.id,
                data_criacao=data_criacao,
                data_conclusao=data_conclusao
            )
            db.add(tarefa)
        db.commit()
        print(f"✅ {N_TAREFAS} tarefas inseridas com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao popular tarefas: {e}")
        db.rollback()
    finally:
        db.close()
        print("🔒 Conexão encerrada.")

if __name__ == "__main__":
    main() 
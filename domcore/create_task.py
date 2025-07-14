#!/usr/bin/env python3
"""
Script para criar tarefas no banco de dados
"""

import argparse
import json
import sys
import os
from datetime import datetime

# Adicionar o diretório domcore ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.db import get_db_connection
from core.config import DATABASE_URL

def create_task(task_data):
    """Cria uma nova tarefa no banco de dados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Preparar dados
        titulo = task_data.get('titulo')
        descricao = task_data.get('descricao')
        status = task_data.get('status', 'pending')
        prioridade = task_data.get('prioridade', 1)
        categoria = task_data.get('categoria')
        data_limite = task_data.get('data_limite')
        responsavel_id = task_data.get('responsavel_id')
        tags = task_data.get('tags', [])
        
        # Converter data_limite se fornecida
        if data_limite:
            try:
                data_limite = datetime.fromisoformat(data_limite.replace('Z', '+00:00'))
            except:
                data_limite = None
        
        # Query de inserção
        query = """
            INSERT INTO tasks (
                titulo, descricao, status, prioridade, categoria,
                data_criacao, data_limite, responsavel_id, tags
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, titulo, descricao, status, prioridade, categoria,
                      data_criacao, data_limite, responsavel_id, tags
        """
        
        params = [
            titulo,
            descricao,
            status,
            prioridade,
            categoria,
            datetime.now(),
            data_limite,
            responsavel_id,
            json.dumps(tags) if tags else None
        ]
        
        cursor.execute(query, params)
        row = cursor.fetchone()
        
        # Preparar resposta
        task = {
            'id': row[0],
            'titulo': row[1],
            'descricao': row[2],
            'status': row[3],
            'prioridade': row[4],
            'categoria': row[5],
            'data_criacao': row[6].isoformat() if row[6] else None,
            'data_limite': row[7].isoformat() if row[7] else None,
            'responsavel_id': row[8],
            'tags': json.loads(row[9]) if row[9] else []
        }
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return task
        
    except Exception as e:
        print(f"Erro ao criar tarefa: {e}", file=sys.stderr)
        if conn:
            conn.rollback()
        return None

def main():
    parser = argparse.ArgumentParser(description='Criar tarefa no banco de dados')
    parser.add_argument('--data', required=True, help='Dados da tarefa em JSON')
    
    args = parser.parse_args()
    
    try:
        task_data = json.loads(args.data)
        task = create_task(task_data)
        
        if task:
            print(json.dumps(task, ensure_ascii=False))
        else:
            sys.exit(1)
            
    except json.JSONDecodeError:
        print("Erro: Dados JSON inválidos", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main() 
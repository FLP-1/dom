#!/usr/bin/env python3
"""
Script para buscar tarefas do banco de dados
"""

import argparse
import json
import sys
import os

# Adicionar o diretório domcore ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.db import get_db_connection
# Removido: from core.config import DATABASE_URL

def get_tasks(profile, limit=50, offset=0, status=None, priority=None, search=None):
    """Busca tarefas do banco de dados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Query base com JOIN para pegar o perfil do usuário
        query = """
            SELECT 
                t.id,
                t.titulo,
                t.descricao,
                t.status,
                t.prioridade,
                t.categoria,
                t.data_criacao,
                t.data_limite,
                t.responsavel_id,
                t.criador_id,
                t.tags,
                t.anexos,
                u_criador.perfil as perfil_criador,
                u_resp.perfil as perfil_responsavel
            FROM tasks t
            LEFT JOIN users u_criador ON t.criador_id = u_criador.id
            LEFT JOIN users u_resp ON t.responsavel_id = u_resp.id
            WHERE 1=1
        """
        params = []
        
        # Filtros
        if profile:
            query += " AND (u_criador.perfil = %s OR u_resp.perfil = %s)"
            params.extend([profile, profile])
        
        if status:
            query += " AND t.status = %s"
            params.append(status)
        
        if priority:
            query += " AND t.prioridade = %s"
            params.append(int(priority))
        
        if search:
            query += " AND (t.titulo ILIKE %s OR t.descricao ILIKE %s)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term])
        
        # Ordenação e paginação
        query += " ORDER BY t.data_criacao DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Converter para JSON
        tasks = []
        for row in rows:
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
                'criador_id': row[9],
                'tags': row[10] if row[10] else [],
                'anexos': row[11] if row[11] else [],
                'perfil_criador': row[12],
                'perfil_responsavel': row[13]
            }
            tasks.append(task)
        
        cursor.close()
        conn.close()
        
        return tasks
        
    except Exception as e:
        print(f"Erro ao buscar tarefas: {e}", file=sys.stderr)
        return []

def main():
    parser = argparse.ArgumentParser(description='Buscar tarefas do banco de dados')
    parser.add_argument('--profile', required=True, help='Perfil do usuário')
    parser.add_argument('--limit', type=int, default=50, help='Limite de resultados')
    parser.add_argument('--offset', type=int, default=0, help='Offset para paginação')
    parser.add_argument('--status', help='Filtrar por status')
    parser.add_argument('--priority', help='Filtrar por prioridade')
    parser.add_argument('--search', help='Termo de busca')
    
    args = parser.parse_args()
    
    tasks = get_tasks(
        profile=args.profile,
        limit=args.limit,
        offset=args.offset,
        status=args.status,
        priority=args.priority,
        search=args.search
    )
    
    print(json.dumps(tasks, ensure_ascii=False))

if __name__ == '__main__':
    main() 
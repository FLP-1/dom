#!/usr/bin/env python3
"""
Script para buscar estatísticas de usuários do banco de dados
"""

import json
import sys
import os

# Adicionar o diretório domcore ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.db import get_db_connection
from core.config import DATABASE_URL

def get_user_stats():
    """Busca estatísticas de usuários do banco de dados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Estatísticas gerais
        cursor.execute("SELECT COUNT(*) FROM users")
        total_usuarios = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users WHERE ativo = true")
        usuarios_ativos = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users WHERE ativo = false")
        usuarios_inativos = cursor.fetchone()[0]
        
        # Usuários por perfil
        cursor.execute("""
            SELECT perfil, COUNT(*) 
            FROM users 
            GROUP BY perfil
        """)
        usuarios_por_perfil = dict(cursor.fetchall())
        
        # Novos usuários no mês atual
        cursor.execute("""
            SELECT COUNT(*) 
            FROM users 
            WHERE EXTRACT(MONTH FROM data_criacao) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM data_criacao) = EXTRACT(YEAR FROM CURRENT_DATE)
        """)
        novos_usuarios_mes = cursor.fetchone()[0]
        
        # Usuários online (últimos 15 minutos)
        cursor.execute("""
            SELECT COUNT(*) 
            FROM users 
            WHERE ultimo_acesso > CURRENT_TIMESTAMP - INTERVAL '15 minutes'
        """)
        usuarios_online = cursor.fetchone()[0]
        
        # Preparar resposta
        stats = {
            'total_usuarios': total_usuarios,
            'usuarios_ativos': usuarios_ativos,
            'usuarios_inativos': usuarios_inativos,
            'usuarios_por_perfil': usuarios_por_perfil,
            'novos_usuarios_mes': novos_usuarios_mes,
            'usuarios_online': usuarios_online
        }
        
        cursor.close()
        conn.close()
        
        return stats
        
    except Exception as e:
        print(f"Erro ao buscar estatísticas: {e}", file=sys.stderr)
        return {
            'total_usuarios': 0,
            'usuarios_ativos': 0,
            'usuarios_inativos': 0,
            'usuarios_por_perfil': {},
            'novos_usuarios_mes': 0,
            'usuarios_online': 0
        }

def main():
    stats = get_user_stats()
    print(json.dumps(stats, ensure_ascii=False))

if __name__ == '__main__':
    main() 
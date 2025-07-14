"""
@fileoverview Script para buscar usuários
@directory domcore
@description Script para buscar usuários do backend via linha de comando
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import json
import argparse
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

# Adicionar o diretório pai ao path para importar os módulos
sys.path.append('.')

from domcore.core.config import config
from domcore.services.user_service import UserService
from domcore.core.db import DATABASE_URL

def get_users(profile=None, limit=50, offset=0, search=None, status=None, ativo=None, grupo=None):
    """Busca usuários com filtros"""
    try:
        # Criar sessão do banco
        engine = create_engine(
            DATABASE_URL,
            poolclass=StaticPool,
            connect_args={"check_same_thread": False}
        )
        
        with Session(engine) as db:
            # Buscar usuários
            result = UserService.get_users(
                db=db,
                skip=offset,
                limit=limit,
                search=search,
                perfil=profile,
                status=status,
                ativo=ativo,
                grupo=grupo
            )
            
            return result
            
    except Exception as e:
        print(f"Erro ao buscar usuários: {str(e)}", file=sys.stderr)
        return None

def main():
    parser = argparse.ArgumentParser(description='Buscar usuários do sistema')
    parser.add_argument('--profile', type=str, help='Perfil dos usuários (empregador, empregado, etc.)')
    parser.add_argument('--limit', type=int, default=50, help='Limite de resultados (padrão: 50)')
    parser.add_argument('--offset', type=int, default=0, help='Offset para paginação (padrão: 0)')
    parser.add_argument('--search', type=str, help='Termo de busca')
    parser.add_argument('--status', type=str, help='Status dos usuários (active, inactive, pending, blocked)')
    parser.add_argument('--ativo', type=str, help='Filtrar por ativo (true/false)')
    parser.add_argument('--grupo', type=str, help='ID do grupo para filtrar')
    
    args = parser.parse_args()
    
    # Converter ativo para boolean se fornecido
    ativo = None
    if args.ativo:
        ativo = args.ativo.lower() == 'true'
    
    # Buscar usuários
    result = get_users(
        profile=args.profile,
        limit=args.limit,
        offset=args.offset,
        search=args.search,
        status=args.status,
        ativo=ativo,
        grupo=args.grupo
    )
    
    if result is not None:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        sys.exit(1)

if __name__ == "__main__":
    main() 
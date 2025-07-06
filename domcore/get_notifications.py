"""
Script para buscar notificações do usuário

@fileoverview Script de busca de notificações do DOM v1
@directory domcore
@description Script para buscar notificações com filtros
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
import json
import argparse
from typing import List, Optional

# Adiciona o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.services.notification_service import NotificationService
from domcore.core.enums import UserProfile, NotificationType

def get_notifications(
    user_id: str,
    profile: str,
    limit: int = 50,
    offset: int = 0,
    unread_only: bool = False,
    notification_type: Optional[str] = None
) -> List[dict]:
    """
    Busca notificações do usuário com filtros
    
    Args:
        user_id: ID do usuário
        profile: Perfil do usuário
        limit: Limite de resultados
        offset: Offset para paginação
        unread_only: Apenas não lidas
        notification_type: Tipo específico de notificação
        
    Returns:
        List[dict]: Lista de notificações
    """
    try:
        # Converte string para enum
        user_profile = UserProfile(profile)
        notification_type_enum = None
        if notification_type:
            notification_type_enum = NotificationType(notification_type)
        
        # Usa o serviço para buscar notificações
        with NotificationService() as service:
            notifications = service.get_user_notifications(
                user_id=user_id,
                profile=user_profile,
                limit=limit,
                offset=offset,
                unread_only=unread_only,
                notification_type=notification_type_enum
            )
            
            # Converte para dicionários
            result = []
            for notification in notifications:
                notification_dict = notification.dict()
                # Converte datetime para string ISO
                notification_dict['data_criacao'] = notification.data_criacao.isoformat()
                notification_dict['data_atualizacao'] = notification.data_atualizacao.isoformat()
                if notification.data_leitura:
                    notification_dict['data_leitura'] = notification.data_leitura.isoformat()
                result.append(notification_dict)
            
            return result
            
    except Exception as e:
        print(f"❌ Erro ao buscar notificações: {e}", file=sys.stderr)
        return []

def main():
    """Função principal do script"""
    parser = argparse.ArgumentParser(description='Buscar notificações do usuário')
    parser.add_argument('--user-id', required=True, help='ID do usuário')
    parser.add_argument('--profile', default='empregador', help='Perfil do usuário')
    parser.add_argument('--limit', type=int, default=50, help='Limite de resultados')
    parser.add_argument('--offset', type=int, default=0, help='Offset para paginação')
    parser.add_argument('--unread-only', action='store_true', help='Apenas não lidas')
    parser.add_argument('--notification-type', help='Tipo específico de notificação')
    
    args = parser.parse_args()
    
    try:
        # Busca notificações
        notifications = get_notifications(
            user_id=args.user_id,
            profile=args.profile,
            limit=args.limit,
            offset=args.offset,
            unread_only=args.unread_only,
            notification_type=args.notification_type
        )
        
        # Retorna como JSON
        print(json.dumps(notifications, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(f"❌ Erro no script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 
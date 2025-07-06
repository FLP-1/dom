"""
Script para marcar notificação como lida

@fileoverview Script de marcação de notificação como lida do DOM v1
@directory domcore
@description Script para marcar uma notificação específica como lida
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
import json
import argparse

# Adiciona o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.services.notification_service import NotificationService

def mark_notification_read(notification_id: str, user_id: str) -> dict:
    """
    Marca uma notificação como lida
    
    Args:
        notification_id: ID da notificação
        user_id: ID do usuário
        
    Returns:
        dict: Notificação atualizada
    """
    try:
        # Usa o serviço para marcar como lida
        with NotificationService() as service:
            notification = service.mark_as_read(
                notification_id=notification_id,
                user_id=user_id
            )
            
            # Converte para dicionário
            notification_dict = notification.dict()
            # Converte datetime para string ISO
            notification_dict['data_criacao'] = notification.data_criacao.isoformat()
            notification_dict['data_atualizacao'] = notification.data_atualizacao.isoformat()
            if notification.data_leitura:
                notification_dict['data_leitura'] = notification.data_leitura.isoformat()
            
            return notification_dict
            
    except Exception as e:
        print(f"❌ Erro ao marcar notificação como lida: {e}", file=sys.stderr)
        raise

def main():
    """Função principal do script"""
    parser = argparse.ArgumentParser(description='Marcar notificação como lida')
    parser.add_argument('--notification-id', required=True, help='ID da notificação')
    parser.add_argument('--user-id', required=True, help='ID do usuário')
    
    args = parser.parse_args()
    
    try:
        # Marca como lida
        notification = mark_notification_read(
            notification_id=args.notification_id,
            user_id=args.user_id
        )
        
        # Retorna como JSON
        print(json.dumps(notification, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(f"❌ Erro no script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 
"""
Script para marcar todas as notificações como lidas

@fileoverview Script de marcação de todas as notificações como lidas do DOM v1
@directory domcore
@description Script para marcar todas as notificações de um usuário como lidas
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

def mark_all_notifications_read(user_id: str) -> dict:
    """
    Marca todas as notificações de um usuário como lidas
    
    Args:
        user_id: ID do usuário
        
    Returns:
        dict: Resultado da operação
    """
    try:
        # Usa o serviço para marcar todas como lidas
        with NotificationService() as service:
            count = service.mark_all_as_read(user_id=user_id)
            
            return {
                "success": True,
                "count": count,
                "message": f"{count} notificações marcadas como lidas"
            }
            
    except Exception as e:
        print(f"❌ Erro ao marcar notificações como lidas: {e}", file=sys.stderr)
        return {
            "success": False,
            "count": 0,
            "message": f"Erro: {str(e)}"
        }

def main():
    """Função principal do script"""
    parser = argparse.ArgumentParser(description='Marcar todas as notificações como lidas')
    parser.add_argument('--user-id', required=True, help='ID do usuário')
    
    args = parser.parse_args()
    
    try:
        # Marca todas como lidas
        result = mark_all_notifications_read(user_id=args.user_id)
        
        # Retorna como JSON
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(f"❌ Erro no script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 
"""
Script para verificar notificações criadas

@fileoverview Script de verificação de notificações do DOM v1
@directory scripts
@description Script para verificar quantas notificações foram criadas no banco
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os

# Adiciona o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.core.db import SessionLocal
from domcore.models.notification import NotificationDB
from sqlalchemy import func

def check_notifications():
    """Verifica as notificações criadas no banco"""
    
    print("🔍 Verificando notificações no banco de dados...")
    
    try:
        db = SessionLocal()
        
        # Conta total de notificações
        total = db.query(NotificationDB).filter(NotificationDB.ativo == True).count()
        print(f"📊 Total de notificações ativas: {total}")
        
        # Conta por tipo
        tipos = db.query(NotificationDB.tipo, func.count(NotificationDB.id)).filter(
            NotificationDB.ativo == True
        ).group_by(NotificationDB.tipo).all()
        
        print(f"\n📋 Notificações por tipo:")
        for tipo, count in tipos:
            print(f"  {tipo}: {count}")
        
        # Conta por prioridade
        prioridades = db.query(NotificationDB.prioridade, func.count(NotificationDB.id)).filter(
            NotificationDB.ativo == True
        ).group_by(NotificationDB.prioridade).all()
        
        print(f"\n📋 Notificações por prioridade:")
        for prioridade, count in prioridades:
            print(f"  {prioridade}: {count}")
        
        # Conta por status de leitura
        lidas = db.query(NotificationDB.lida, func.count(NotificationDB.id)).filter(
            NotificationDB.ativo == True
        ).group_by(NotificationDB.lida).all()
        
        print(f"\n📋 Notificações por status de leitura:")
        for lida, count in lidas:
            status = "Lida" if lida else "Não lida"
            print(f"  {status}: {count}")
        
        # Mostra algumas notificações de exemplo
        print(f"\n📝 Exemplos de notificações:")
        exemplos = db.query(NotificationDB).filter(
            NotificationDB.ativo == True
        ).limit(5).all()
        
        for i, notif in enumerate(exemplos, 1):
            print(f"  {i}. {notif.titulo} ({notif.tipo}) - {notif.prioridade}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Erro ao verificar notificações: {e}")
        raise

if __name__ == "__main__":
    check_notifications() 
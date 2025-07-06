"""
Script para popular notificações de teste

@fileoverview Script de população de notificações do DOM v1
@directory scripts
@description Script para criar notificações de teste no banco de dados
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
import random
from datetime import datetime, timedelta

# Adiciona o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.services.notification_service import NotificationService
from domcore.services.user_service import UserService
from domcore.core.enums import NotificationType, UserProfile
from domcore.core.db import SessionLocal

def create_test_notifications():
    """Cria notificações de teste para todos os usuários"""
    
    print("🚀 Iniciando criação de notificações de teste...")
    
    try:
        # Busca todos os usuários
        db = SessionLocal()
        users_data = UserService.get_users(db)
        users = users_data["items"]
        
        if not users:
            print("❌ Nenhum usuário encontrado. Execute primeiro o script de população de usuários.")
            return
        
        print(f"📋 Encontrados {len(users)} usuários")
        
        # Tipos de notificação disponíveis
        notification_types = [
            NotificationType.TASK_CREATED,
            NotificationType.TASK_COMPLETED,
            NotificationType.TASK_OVERDUE,
            NotificationType.PAYMENT_DUE,
            NotificationType.PAYMENT_RECEIVED,
            NotificationType.SYSTEM_ALERT,
            NotificationType.FAMILY_SHARE
        ]
        
        # Prioridades
        priorities = ['baixa', 'normal', 'alta', 'urgente']
        
        # Categorias
        categories = ['tarefas', 'pagamentos', 'sistema', 'familia']
        
        # Títulos e mensagens por tipo
        notification_templates = {
            NotificationType.TASK_CREATED: {
                'titles': [
                    'Nova Tarefa Criada',
                    'Tarefa Atribuída',
                    'Nova Atividade',
                    'Tarefa Pendente'
                ],
                'messages': [
                    'Uma nova tarefa foi criada para você',
                    'Você tem uma nova tarefa para realizar',
                    'Nova atividade foi adicionada à sua lista',
                    'Uma tarefa foi atribuída ao seu perfil'
                ]
            },
            NotificationType.TASK_COMPLETED: {
                'titles': [
                    'Tarefa Concluída',
                    'Atividade Finalizada',
                    'Tarefa Completada',
                    'Trabalho Realizado'
                ],
                'messages': [
                    'Parabéns! Uma tarefa foi concluída com sucesso',
                    'Atividade foi finalizada com êxito',
                    'Tarefa foi completada dentro do prazo',
                    'Trabalho foi realizado com qualidade'
                ]
            },
            NotificationType.TASK_OVERDUE: {
                'titles': [
                    'Tarefa Atrasada',
                    'Prazo Expirado',
                    'Tarefa Pendente',
                    'Atenção: Tarefa Atrasada'
                ],
                'messages': [
                    'Uma tarefa está atrasada e precisa de atenção',
                    'O prazo para uma tarefa expirou',
                    'Tarefa pendente que requer ação imediata',
                    'Atenção: há uma tarefa atrasada'
                ]
            },
            NotificationType.PAYMENT_DUE: {
                'titles': [
                    'Pagamento Pendente',
                    'Vencimento Próximo',
                    'Pagamento Devido',
                    'Atenção: Pagamento'
                ],
                'messages': [
                    'Você tem um pagamento pendente',
                    'O vencimento de um pagamento está próximo',
                    'Há um pagamento devido que precisa ser realizado',
                    'Atenção: há um pagamento pendente'
                ]
            },
            NotificationType.PAYMENT_RECEIVED: {
                'titles': [
                    'Pagamento Recebido',
                    'Pagamento Confirmado',
                    'Recebimento Confirmado',
                    'Pagamento Processado'
                ],
                'messages': [
                    'Um pagamento foi recebido com sucesso',
                    'Pagamento foi confirmado e processado',
                    'Recebimento foi confirmado no sistema',
                    'Pagamento foi processado com êxito'
                ]
            },
            NotificationType.SYSTEM_ALERT: {
                'titles': [
                    'Alerta do Sistema',
                    'Aviso Importante',
                    'Notificação do Sistema',
                    'Informação do Sistema'
                ],
                'messages': [
                    'O sistema tem uma informação importante para você',
                    'Aviso importante do sistema',
                    'Notificação do sistema que requer atenção',
                    'Informação relevante do sistema'
                ]
            },
            NotificationType.FAMILY_SHARE: {
                'titles': [
                    'Compartilhamento Familiar',
                    'Atualização Familiar',
                    'Informação da Família',
                    'Compartilhamento'
                ],
                'messages': [
                    'Há uma atualização compartilhada pela família',
                    'Informação importante da família',
                    'Compartilhamento familiar que pode interessar',
                    'Atualização compartilhada pelos familiares'
                ]
            }
        }
        
        # Cria notificações para cada usuário
        total_created = 0
        
        with NotificationService() as notification_service:
            for user in users:
                print(f"📝 Criando notificações para usuário: {user['name']} ({user['perfil']})")
                
                # Número de notificações por usuário (baseado no perfil)
                profile_notification_counts = {
                    UserProfile.EMPREGADOR: random.randint(8, 15),
                    UserProfile.EMPREGADO: random.randint(5, 10),
                    UserProfile.FAMILIAR: random.randint(3, 8),
                    UserProfile.PARCEIRO: random.randint(12, 20),
                    UserProfile.SUBORDINADO: random.randint(6, 12),
                    UserProfile.ADMIN: random.randint(15, 25),
                    UserProfile.OWNER: random.randint(20, 30)
                }
                
                # Mapeia perfis do banco para enum
                profile_mapping = {
                    'empregador': UserProfile.EMPREGADOR,
                    'empregado': UserProfile.EMPREGADO,
                    'familiar': UserProfile.FAMILIAR,
                    'parceiro': UserProfile.PARCEIRO,
                    'subordinado': UserProfile.SUBORDINADO,
                    'admin': UserProfile.ADMIN,
                    'owner': UserProfile.OWNER
                }
                
                user_profile = profile_mapping.get(user['perfil'], UserProfile.EMPREGADOR)
                notification_count = profile_notification_counts.get(user_profile, 10)
                
                for i in range(notification_count):
                    # Seleciona tipo aleatório
                    notification_type = random.choice(notification_types)
                    
                    # Obtém template
                    template = notification_templates[notification_type]
                    title = random.choice(template['titles'])
                    message = random.choice(template['messages'])
                    
                    # Seleciona prioridade (urgente é mais raro)
                    priority_weights = {
                        'baixa': 0.3,
                        'normal': 0.5,
                        'alta': 0.15,
                        'urgente': 0.05
                    }
                    priority = random.choices(
                        list(priority_weights.keys()),
                        weights=list(priority_weights.values())
                    )[0]
                    
                    # Seleciona categoria
                    category = random.choice(categories)
                    
                    # Data de criação (últimos 30 dias)
                    days_ago = random.randint(0, 30)
                    creation_date = datetime.utcnow() - timedelta(days=days_ago)
                    
                    # Se é lida (70% de chance)
                    is_read = random.random() < 0.7
                    
                    # Dados extras
                    dados_extras = {
                        'created_by_script': True,
                        'test_data': True,
                        'user_profile': user['perfil']
                    }
                    
                    # Cria a notificação
                    from domcore.models.notification import NotificationCreate
                    
                    notification_data = NotificationCreate(
                        tipo=notification_type,
                        titulo=title,
                        mensagem=message,
                        destinatario_id=str(user['id']),
                        remetente_id=None,  # Sistema
                        prioridade=priority,
                        categoria=category,
                        dados_extras=dados_extras
                    )
                    
                    try:
                        notification = notification_service.create_notification(notification_data)
                        total_created += 1
                        
                        # Se é lida, marca como lida
                        if is_read:
                            notification_service.mark_as_read(str(notification.id), str(user['id']))
                        
                    except Exception as e:
                        print(f"❌ Erro ao criar notificação: {e}")
                        continue
                
                print(f"✅ Criadas {notification_count} notificações para {user['name']}")
        
        print(f"\n🎉 Processo concluído!")
        print(f"📊 Total de notificações criadas: {total_created}")
        print(f"👥 Usuários processados: {len(users)}")
        
    except Exception as e:
        print(f"❌ Erro durante a criação de notificações: {e}")
        raise

if __name__ == "__main__":
    create_test_notifications() 
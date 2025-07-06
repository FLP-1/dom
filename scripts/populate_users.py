"""
@fileoverview Script para popular usuários
@directory scripts
@description Script para popular tabela de usuários com dados de teste
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from domcore.core.db import SessionLocal
from domcore.models.user import UserDB, UserGroupRole
from domcore.models.group import Group
from domcore.services.user_service import UserService
from domcore.utils.cpf_validator import CPFValidator
import random
from datetime import datetime, timedelta
from sqlalchemy import func

# Dados de exemplo para usuários
USERS_DATA = [
    # Empregadores
    {
        "name": "Maria Silva Santos",
        "nickname": "Maria",
        "cpf": "12345678901",
        "email": "maria.silva@email.com",
        "celular": "(11) 99999-1111",
        "perfil": "empregador"
    },
    {
        "name": "João Carlos Oliveira",
        "nickname": "João",
        "cpf": "23456789012",
        "email": "joao.oliveira@email.com",
        "celular": "(11) 99999-2222",
        "perfil": "empregador"
    },
    {
        "name": "Ana Paula Costa",
        "nickname": "Ana",
        "cpf": "34567890123",
        "email": "ana.costa@email.com",
        "celular": "(11) 99999-3333",
        "perfil": "empregador"
    },
    
    # Empregados
    {
        "name": "Rosa Ferreira Lima",
        "nickname": "Rosa",
        "cpf": "45678901234",
        "email": "rosa.lima@email.com",
        "celular": "(11) 99999-4444",
        "perfil": "empregado"
    },
    {
        "name": "Carmen Santos Silva",
        "nickname": "Carmen",
        "cpf": "56789012345",
        "email": "carmen.silva@email.com",
        "celular": "(11) 99999-5555",
        "perfil": "empregado"
    },
    {
        "name": "Lucia Oliveira Costa",
        "nickname": "Lucia",
        "cpf": "67890123456",
        "email": "lucia.costa@email.com",
        "celular": "(11) 99999-6666",
        "perfil": "empregado"
    },
    {
        "name": "Tereza Ferreira Santos",
        "nickname": "Tereza",
        "cpf": "78901234567",
        "email": "tereza.santos@email.com",
        "celular": "(11) 99999-7777",
        "perfil": "empregado"
    },
    {
        "name": "Isabel Costa Lima",
        "nickname": "Isabel",
        "cpf": "89012345678",
        "email": "isabel.lima@email.com",
        "celular": "(11) 99999-8888",
        "perfil": "empregado"
    },
    
    # Familiares
    {
        "name": "Pedro Silva Costa",
        "nickname": "Pedro",
        "cpf": "90123456789",
        "email": "pedro.costa@email.com",
        "celular": "(11) 99999-9999",
        "perfil": "familiar"
    },
    {
        "name": "Carlos Oliveira Santos",
        "nickname": "Carlos",
        "cpf": "01234567890",
        "email": "carlos.santos@email.com",
        "celular": "(11) 99999-0000",
        "perfil": "familiar"
    },
    {
        "name": "Fernanda Costa Silva",
        "nickname": "Fernanda",
        "cpf": "11122233344",
        "email": "fernanda.silva@email.com",
        "celular": "(11) 99999-1111",
        "perfil": "familiar"
    },
    
    # Parceiros
    {
        "name": "Roberto Santos Lima",
        "nickname": "Roberto",
        "cpf": "22233344455",
        "email": "roberto.lima@email.com",
        "celular": "(11) 99999-2222",
        "perfil": "parceiro"
    },
    {
        "name": "Patricia Oliveira Costa",
        "nickname": "Patricia",
        "cpf": "33344455566",
        "email": "patricia.costa@email.com",
        "celular": "(11) 99999-3333",
        "perfil": "parceiro"
    },
    
    # Subordinados
    {
        "name": "Marcos Silva Santos",
        "nickname": "Marcos",
        "cpf": "44455566677",
        "email": "marcos.santos@email.com",
        "celular": "(11) 99999-4444",
        "perfil": "subordinado"
    },
    {
        "name": "Juliana Costa Lima",
        "nickname": "Juliana",
        "cpf": "55566677788",
        "email": "juliana.lima@email.com",
        "celular": "(11) 99999-5555",
        "perfil": "subordinado"
    },
    
    # Admin e Owner
    {
        "name": "Administrador Sistema",
        "nickname": "Admin",
        "cpf": "66677788899",
        "email": "admin@sistema.com",
        "celular": "(11) 99999-6666",
        "perfil": "admin"
    },
    {
        "name": "Proprietário Sistema",
        "nickname": "Owner",
        "cpf": "77788899900",
        "email": "owner@sistema.com",
        "celular": "(11) 99999-7777",
        "perfil": "owner"
    }
]

def generate_random_cpf():
    """Gera um CPF válido aleatório"""
    # Gerar 9 dígitos aleatórios
    digits = [random.randint(0, 9) for _ in range(9)]
    
    # Calcular primeiro dígito verificador
    sum1 = sum(digits[i] * (10 - i) for i in range(9))
    digit1 = (sum1 * 10) % 11
    if digit1 == 10:
        digit1 = 0
    digits.append(digit1)
    
    # Calcular segundo dígito verificador
    sum2 = sum(digits[i] * (11 - i) for i in range(10))
    digit2 = (sum2 * 10) % 11
    if digit2 == 10:
        digit2 = 0
    digits.append(digit2)
    
    # Formatar CPF
    cpf = ''.join(map(str, digits))
    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"

def create_additional_users(count=50):
    """Cria usuários adicionais aleatórios"""
    names = [
        "Silva", "Santos", "Oliveira", "Costa", "Ferreira", "Lima", "Pereira", "Carvalho",
        "Almeida", "Nascimento", "Ribeiro", "Souza", "Rodrigues", "Alves", "Lopes", "Fernandes"
    ]
    
    first_names = [
        "Maria", "João", "Ana", "Pedro", "Lucia", "Carlos", "Rosa", "Antonio", "Isabel", "Roberto",
        "Carmen", "Fernando", "Tereza", "Marcos", "Patricia", "Ricardo", "Juliana", "Eduardo",
        "Fernanda", "Lucas", "Beatriz", "Gabriel", "Amanda", "Rafael", "Carolina", "Thiago"
    ]
    
    additional_users = []
    
    for i in range(count):
        first_name = random.choice(first_names)
        last_name = random.choice(names)
        name = f"{first_name} {last_name}"
        
        # Gerar CPF único
        cpf = generate_random_cpf()
        
        # Escolher perfil baseado na distribuição
        perfil_weights = {
            "empregador": 0.15,
            "empregado": 0.40,
            "familiar": 0.25,
            "parceiro": 0.10,
            "subordinado": 0.08,
            "admin": 0.01,
            "owner": 0.01
        }
        
        perfil = random.choices(
            list(perfil_weights.keys()),
            weights=list(perfil_weights.values())
        )[0]
        
        user_data = {
            "name": name,
            "nickname": first_name,
            "cpf": cpf,
            "email": f"{first_name.lower()}.{last_name.lower()}@email.com",
            "celular": f"(11) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
            "perfil": perfil
        }
        
        additional_users.append(user_data)
    
    return additional_users

def populate_users():
    """Popula a tabela de usuários"""
    db = SessionLocal()
    
    try:
        print("🚀 Iniciando população de usuários...")
        
        # Verificar se já existem usuários
        existing_count = db.query(UserDB).count()
        if existing_count > 0:
            print(f"⚠️  Já existem {existing_count} usuários no banco.")
            response = input("Deseja continuar e adicionar mais usuários? (s/N): ")
            if response.lower() != 's':
                print("❌ Operação cancelada.")
                return
        
        # Gerar CPFs válidos para todos os usuários principais
        for user in USERS_DATA:
            user["cpf"] = generate_random_cpf()
        
        # Criar usuários principais
        print("📝 Criando usuários principais...")
        created_users = []
        
        for user_data in USERS_DATA:
            try:
                # Gerar senha padrão
                user_data["password"] = "123456"
                
                # Criar usuário
                user = UserService.create_user(db, user_data)
                created_users.append(user)
                print(f"✅ Criado: {user.nome} ({user.perfil})")
                
            except Exception as e:
                print(f"❌ Erro ao criar {user_data['name']}: {e}")
        
        # Criar usuários adicionais
        print("📝 Criando usuários adicionais...")
        additional_users = create_additional_users(50)
        
        for user_data in additional_users:
            try:
                # Verificar se CPF já existe
                existing = UserService.get_user_by_cpf(db, user_data["cpf"])
                if existing:
                    continue
                
                # Gerar senha padrão
                user_data["password"] = "123456"
                
                # Criar usuário
                user = UserService.create_user(db, user_data)
                created_users.append(user)
                print(f"✅ Criado: {user.nome} ({user.perfil})")
                
            except Exception as e:
                print(f"❌ Erro ao criar {user_data['name']}: {e}")
        
        # Atualizar último acesso para alguns usuários
        print("🕐 Atualizando último acesso...")
        for user in random.sample(created_users, min(20, len(created_users))):
            # Último acesso entre 1 hora e 7 dias atrás
            hours_ago = random.randint(1, 168)
            user.ultimo_login = datetime.utcnow() - timedelta(hours=hours_ago)
        
        db.commit()
        
        # Estatísticas finais
        total_users = db.query(UserDB).count()
        active_users = db.query(UserDB).filter(UserDB.ativo == True).count()
        inactive_users = db.query(UserDB).filter(UserDB.ativo == False).count()
        
        print("\n🎉 População concluída!")
        print(f"📊 Estatísticas:")
        print(f"   • Total de usuários: {total_users}")
        print(f"   • Usuários ativos: {active_users}")
        print(f"   • Usuários inativos: {inactive_users}")
        
        # Distribuição por perfil
        print(f"\n👥 Distribuição por perfil:")
        perfis = db.query(UserDB.perfil, func.count(UserDB.id)).group_by(UserDB.perfil).all()
        for perfil, count in perfis:
            print(f"   • {perfil}: {count}")
        
        print(f"\n🔑 Senha padrão para todos os usuários: 123456")
        
    except Exception as e:
        print(f"❌ Erro durante a população: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    populate_users() 
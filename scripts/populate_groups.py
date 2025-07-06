"""
Script para popular grupos com dados de teste
@fileoverview Populate Groups Script
@directory scripts
@description Script para criar grupos de teste realistas
@created 2024-12-19
@lastModified 2024-12-19
@author DOM Team
"""

import sys
import os
import random
from datetime import datetime, timedelta

# Adicionar domcore ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'domcore'))

from domcore.core.db import SessionLocal
from domcore.models.group import Group
from domcore.models.user import UserDB, UserGroupRole
from domcore.services.group_service import GroupService

def create_test_groups():
    """Cria grupos de teste realistas"""
    
    # Dados de grupos de teste
    test_groups = [
        {
            "nome": "Família Silva",
            "descricao": "Núcleo familiar principal da casa",
            "tipo": "familia"
        },
        {
            "nome": "Família Santos",
            "descricao": "Família extensa com avós e tios",
            "tipo": "familia"
        },
        {
            "nome": "Residência Jardim Europa",
            "descricao": "Casa principal com empregados domésticos",
            "tipo": "residencia"
        },
        {
            "nome": "Apartamento Centro",
            "descricao": "Apartamento de trabalho no centro da cidade",
            "tipo": "residencia"
        },
        {
            "nome": "Chácara Fim de Semana",
            "descricao": "Propriedade rural para lazer",
            "tipo": "residencia"
        },
        {
            "nome": "Escritório Empresarial",
            "descricao": "Escritório com equipe de limpeza",
            "tipo": "empresa"
        },
        {
            "nome": "Loja Shopping",
            "descricao": "Loja com funcionários e limpeza",
            "tipo": "empresa"
        },
        {
            "nome": "Condomínio Solar",
            "descricao": "Condomínio residencial com portaria",
            "tipo": "condominio"
        },
        {
            "nome": "Clínica Médica",
            "descricao": "Clínica com equipe de limpeza",
            "tipo": "empresa"
        },
        {
            "nome": "Restaurante Familiar",
            "descricao": "Restaurante com equipe completa",
            "tipo": "empresa"
        }
    ]
    
    db = SessionLocal()
    
    try:
        print("🔄 Iniciando criação de grupos de teste...")
        
        # Buscar usuários existentes
        users = db.query(UserDB).filter(UserDB.ativo == True).all()
        
        if not users:
            print("❌ Nenhum usuário encontrado. Execute primeiro o script de usuários.")
            return
        
        print(f"✅ Encontrados {len(users)} usuários para associar aos grupos")
        
        created_groups = []
        
        for i, group_data in enumerate(test_groups):
            try:
                # Criar grupo
                group = Group(
                    nome=group_data["nome"],
                    descricao=group_data["descricao"],
                    tipo=group_data["tipo"],
                    ativo=True
                )
                
                db.add(group)
                db.commit()
                db.refresh(group)
                
                created_groups.append(group)
                print(f"✅ Grupo criado: {group.nome} (ID: {group.id})")
                
                # Adicionar membros ao grupo
                num_members = random.randint(2, min(6, len(users)))
                selected_users = random.sample(users, num_members)
                
                for j, user in enumerate(selected_users):
                    # Definir papel baseado na posição
                    if j == 0:
                        role = "admin"  # Primeiro usuário é admin
                    elif j == 1:
                        role = "moderator"  # Segundo usuário é moderador
                    else:
                        role = "member"  # Demais são membros
                    
                    # Criar relacionamento usuário-grupo
                    user_group = UserGroupRole(
                        user_id=user.id,
                        group_id=group.id,
                        role=role,
                        ativo=True
                    )
                    
                    db.add(user_group)
                    print(f"   👤 Adicionado {user.nome} como {role}")
                
                db.commit()
                
            except Exception as e:
                print(f"❌ Erro ao criar grupo {group_data['nome']}: {e}")
                db.rollback()
                continue
        
        print(f"\n✅ Processo concluído!")
        print(f"📊 Grupos criados: {len(created_groups)}")
        
        # Mostrar estatísticas
        total_groups = db.query(Group).filter(Group.ativo == True).count()
        total_memberships = db.query(UserGroupRole).filter(UserGroupRole.ativo == True).count()
        
        print(f"📈 Total de grupos ativos: {total_groups}")
        print(f"👥 Total de membroships ativos: {total_memberships}")
        
        # Mostrar distribuição por tipo
        print("\n📋 Distribuição por tipo:")
        tipos = db.query(Group.tipo, db.func.count(Group.id)).filter(Group.ativo == True).group_by(Group.tipo).all()
        for tipo, count in tipos:
            print(f"   {tipo}: {count} grupos")
        
        # Mostrar distribuição por papel
        print("\n👑 Distribuição por papel:")
        roles = db.query(UserGroupRole.role, db.func.count(UserGroupRole.id)).filter(UserGroupRole.ativo == True).group_by(UserGroupRole.role).all()
        for role, count in roles:
            print(f"   {role}: {count} membros")
        
    except Exception as e:
        print(f"❌ Erro geral: {e}")
        db.rollback()
    finally:
        db.close()

def show_groups_info():
    """Mostra informações sobre os grupos existentes"""
    db = SessionLocal()
    
    try:
        print("\n📊 INFORMAÇÕES DOS GRUPOS EXISTENTES")
        print("=" * 50)
        
        groups = db.query(Group).filter(Group.ativo == True).all()
        
        if not groups:
            print("❌ Nenhum grupo encontrado")
            return
        
        for group in groups:
            print(f"\n🏠 {group.nome}")
            print(f"   Tipo: {group.tipo}")
            print(f"   Descrição: {group.descricao}")
            print(f"   Criado em: {group.data_criacao}")
            
            # Contar membros
            members = db.query(UserGroupRole).filter(
                UserGroupRole.group_id == group.id,
                UserGroupRole.ativo == True
            ).all()
            
            print(f"   Membros: {len(members)}")
            
            # Mostrar membros
            for member in members:
                user = db.query(UserDB).filter(UserDB.id == member.user_id).first()
                if user:
                    print(f"     👤 {user.nome} ({member.role})")
        
    except Exception as e:
        print(f"❌ Erro ao mostrar informações: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 SCRIPT DE POPULAÇÃO DE GRUPOS - DOM v1")
    print("=" * 50)
    
    # Verificar se já existem grupos
    db = SessionLocal()
    existing_groups = db.query(Group).filter(Group.ativo == True).count()
    db.close()
    
    if existing_groups > 0:
        print(f"⚠️  Já existem {existing_groups} grupos ativos no sistema")
        response = input("Deseja continuar e adicionar mais grupos? (s/N): ")
        if response.lower() != 's':
            print("❌ Operação cancelada")
            sys.exit(0)
    
    # Criar grupos
    create_test_groups()
    
    # Mostrar informações
    show_groups_info()
    
    print("\n✅ Script concluído com sucesso!") 
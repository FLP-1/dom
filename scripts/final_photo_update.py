#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script final para atualizar a foto do usuário
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from domcore.core.db import SessionLocal
from domcore.models.user import UserDB

def update_user_photo():
    """Atualiza a foto do usuário"""
    
    # Caminho da imagem
    image_path = os.path.join('Imagens_Logos', 'Logo_Pessoas.png')
    
    # Verificar se o arquivo existe
    if not os.path.exists(image_path):
        print(f"❌ Arquivo não encontrado: {image_path}")
        return False
    
    print(f"✅ Arquivo encontrado: {image_path}")
    
    # Ler imagem e converter para bytes
    try:
        with open(image_path, "rb") as f:
            photo_bytes = f.read()
        print(f"✅ Arquivo lido: {len(photo_bytes)} bytes")
    except Exception as e:
        print(f"❌ Erro ao ler arquivo: {e}")
        return False
    
    # CPF alvo
    cpf = "987.654.321-00"
    
    # Função para normalizar CPF
    normalize_cpf = lambda c: c.replace('.', '').replace('-', '')
    
    # Atualizar no banco
    db: Session = SessionLocal()
    try:
        # Buscar usuário
        users = db.query(UserDB).all()
        user = next((u for u in users if normalize_cpf(u.cpf) == normalize_cpf(cpf)), None)
        
        if user:
            print(f"✅ Usuário encontrado: {user.nome} (ID: {user.id})")
            
            # Atualizar a foto
            user.user_photo = photo_bytes
            print("✅ Foto atribuída ao usuário")
            
            # Fazer commit explícito
            db.commit()
            print("✅ Commit realizado!")
            
            # Verificar se foi salva
            db.refresh(user)
            if user.user_photo:
                print(f"✅ Foto confirmada no banco: {len(user.user_photo)} bytes")
            else:
                print("❌ Foto não foi salva no banco")
                
        else:
            print("❌ Usuário não encontrado!")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao atualizar banco: {e}")
        db.rollback()
        return False
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    print("🖼️  Atualizando foto do usuário...")
    success = update_user_photo()
    
    if success:
        print("\n🎉 Atualização concluída com sucesso!")
        print("Agora você pode verificar no dashboard!")
    else:
        print("\n❌ Atualização falhou!") 
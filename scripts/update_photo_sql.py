#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script para atualizar foto usando SQL puro
"""

import psycopg2
import os

def update_photo_sql():
    """Atualiza a foto usando SQL puro"""
    
    # Configurações do banco
    db_config = {
        'host': 'localhost',
        'port': 5432,
        'database': 'db_dom',
        'user': 'user_dom',
        'password': 'FLP*2025'  # ⚠️ ALTERE PARA SUA SENHA REAL
    }
    
    # Caminho da imagem
    image_path = os.path.join('Imagens_Logos', 'Logo_Pessoas.png')
    
    # Verificar se o arquivo existe
    if not os.path.exists(image_path):
        print(f"❌ Arquivo não encontrado: {image_path}")
        return False
    
    print(f"✅ Arquivo encontrado: {image_path}")
    
    try:
        # Conectar ao banco
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        
        # Ler imagem
        with open(image_path, "rb") as f:
            photo_bytes = f.read()
        print(f"✅ Arquivo lido: {len(photo_bytes)} bytes")
        
        # Atualizar a foto
        cursor.execute(
            "UPDATE users SET user_photo = %s WHERE cpf = %s",
            (photo_bytes, '98765432100')
        )
        
        # Verificar se alguma linha foi afetada
        if cursor.rowcount > 0:
            conn.commit()
            print(f"✅ Foto atualizada! {cursor.rowcount} linha(s) afetada(s)")
        else:
            print("❌ Nenhuma linha foi atualizada")
            return False
        
        # Verificar se foi salva
        cursor.execute(
            "SELECT user_photo FROM users WHERE cpf = %s",
            ('98765432100',)
        )
        result = cursor.fetchone()
        
        if result and result[0]:
            print(f"✅ Foto confirmada no banco: {len(result[0])} bytes")
        else:
            print("❌ Foto não foi salva no banco")
            return False
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

if __name__ == "__main__":
    print("🖼️  Atualizando foto com SQL puro...")
    success = update_photo_sql()
    
    if success:
        print("\n🎉 Atualização concluída com sucesso!")
    else:
        print("\n❌ Atualização falhou!") 
"""
Atualiza o nickname e a foto do usuário com CPF 987.654.321-00
@fileoverview Atualiza nickname e foto do usuário
@directory scripts
@description Atualiza nickname e foto do usuário no banco de dados
@created 2024-12-19
@lastModified 2024-12-19
@author DOM Team
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from domcore.core.db import SessionLocal
from domcore.models.user import UserDB

# Caminho da imagem
image_path = os.path.join('Imagens_Logos', 'Logo_Pessoas.png')
# CPF alvo
cpf = "987.654.321-00"
# Novo nickname
nickname = "Empregador Maria"

# Ler imagem e converter para bytes
with open(image_path, "rb") as f:
    photo_bytes = f.read()

# Função para normalizar CPF
normalize_cpf = lambda c: c.replace('.', '').replace('-', '')

# Atualizar no banco
db: Session = SessionLocal()
users = db.query(UserDB).all()
user = next((u for u in users if normalize_cpf(u.cpf) == normalize_cpf(cpf)), None)
if user:
    user.nickname = nickname
    user.user_photo = photo_bytes
    db.commit()
    print("Usuário atualizado com sucesso!")
else:
    print("Usuário não encontrado!")
db.close() 
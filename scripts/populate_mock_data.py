"""
Popula o banco de dados DOM v1 com dados mockados para testes (usuários, grupos, contextos)
@created 2024-12-19
@author DOM Team
"""
import uuid
import random
import os
from sqlalchemy import create_engine, text
from faker import Faker
from cpf_validator import generate_valid_cpf_raw

# Configuração do banco
DATABASE_URL = "postgresql://postgres:FLP*2025@localhost:5432/db_dom"
engine = create_engine(DATABASE_URL)

# Fotos disponíveis
PHOTOS = ['Foto1.png', 'Foto2.png', 'Foto3.png', 'Foto4.png']
PHOTOS_PATH = os.path.join(os.getcwd(), 'Imagens_Logos')

fake = Faker('pt_BR')

# Criar 10 grupos
print('Criando grupos...')
with engine.connect() as conn:
    for _ in range(10):
        group_id = str(uuid.uuid4())
        group_name = fake.company()
        conn.execute(text("INSERT INTO groups (id, name) VALUES (:id, :name)"), 
                    {"id": group_id, "name": group_name})
    conn.commit()

# Criar 20 usuários
print('Criando usuários...')
with engine.connect() as conn:
    for i in range(20):
        user_id = str(uuid.uuid4())
        user_name = fake.name()
        user_nickname = fake.user_name()[:20]  # Nickname até 20 caracteres
        user_cpf = generate_valid_cpf_raw()  # CPF sem máscara
        user_email = fake.email()
        user_photo_file = random.choice(PHOTOS)
        photo_path = os.path.join(PHOTOS_PATH, user_photo_file)
        with open(photo_path, 'rb') as f:
            user_photo_bytes = f.read()
        
        conn.execute(text("INSERT INTO users (id, name, nickname, cpf, email, photo, password) VALUES (:id, :name, :nickname, :cpf, :email, :photo, :password)"), 
                    {"id": user_id, "name": user_name, "nickname": user_nickname, "cpf": user_cpf, "email": user_email, "photo": user_photo_bytes, "password": "senha_hash"})
    conn.commit()

# Criar contextos aleatórios
print('Criando contextos (UserGroupRole)...')
with engine.connect() as conn:
    # Buscar todos os usuários e grupos
    users_result = conn.execute(text("SELECT id FROM users"))
    groups_result = conn.execute(text("SELECT id FROM groups"))
    users = [row[0] for row in users_result]
    groups = [row[0] for row in groups_result]
    
    roles = ['empregador', 'empregado', 'familiar']
    created_contexts = set()  # Para evitar duplicatas
    
    for user_id in users:
        # Cada usuário participa de 1 a 3 grupos
        num_groups = random.randint(1, min(3, len(groups)))
        available_groups = [g for g in groups if (user_id, g) not in created_contexts]
        
        if available_groups:
            selected_groups = random.sample(available_groups, min(num_groups, len(available_groups)))
            for group_id in selected_groups:
                role = random.choice(roles)
                ctx_id = str(uuid.uuid4())
                conn.execute(text("INSERT INTO user_group_roles (id, user_id, group_id, role) VALUES (:id, :user_id, :group_id, :role)"), 
                            {"id": ctx_id, "user_id": user_id, "group_id": group_id, "role": role})
                created_contexts.add((user_id, group_id))
    conn.commit()

engine.dispose()
print('População de dados mockados concluída!') 
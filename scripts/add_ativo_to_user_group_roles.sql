-- Adiciona a coluna 'ativo' na tabela user_group_roles
ALTER TABLE user_group_roles
ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE; 
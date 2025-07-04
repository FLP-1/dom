-- Script para adicionar coluna nickname na tabela users
-- Execute este script diretamente no PostgreSQL (psql, pgAdmin, etc.)

-- Verificar se a coluna já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'nickname'
    ) THEN
        -- Adicionar a coluna nickname
        ALTER TABLE users ADD COLUMN nickname VARCHAR(50) NULL;
        RAISE NOTICE 'Coluna nickname adicionada com sucesso na tabela users';
    ELSE
        RAISE NOTICE 'Coluna nickname já existe na tabela users';
    END IF;
END $$; 
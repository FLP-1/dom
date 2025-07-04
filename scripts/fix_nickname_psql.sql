-- Script para corrigir o tipo da coluna nickname
-- Execute este script diretamente no PostgreSQL

-- Altera a coluna nickname de array para VARCHAR(100)
ALTER TABLE users 
ALTER COLUMN nickname TYPE VARCHAR(100) USING nickname::VARCHAR(100);

-- Verifica se a alteração foi aplicada
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'nickname';

-- Mostra alguns registros para verificar
SELECT id, cpf, nome, nickname FROM users LIMIT 5; 
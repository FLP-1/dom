-- Script para corrigir o tipo da coluna nickname
-- Altera a coluna nickname de array para VARCHAR(100)

ALTER TABLE users 
ALTER COLUMN nickname TYPE VARCHAR(100) USING nickname::VARCHAR(100);

-- Verificar se a alteração foi aplicada
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'nickname'; 
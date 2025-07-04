-- Verificar estrutura da tabela users
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position; 
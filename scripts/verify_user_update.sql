-- Verificar se o nickname e foto foram atualizados
SELECT 
    id,
    cpf,
    nome,
    nickname,
    CASE 
        WHEN user_photo IS NOT NULL THEN 'Foto presente (' || length(user_photo) || ' bytes)'
        ELSE 'Sem foto'
    END as foto_status
FROM users 
WHERE cpf = '98765432100'; 
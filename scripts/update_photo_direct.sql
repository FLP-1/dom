-- Script para atualizar a foto do usuário diretamente
-- Vamos usar uma imagem pequena (favicon) para teste

-- Primeiro, vamos verificar o usuário
SELECT id, cpf, nome, nickname FROM users WHERE cpf = '98765432100';

-- Agora vamos atualizar a foto com uma imagem pequena
-- Como não podemos ler arquivo diretamente no SQL, vamos usar uma abordagem diferente
-- Vamos limpar a foto atual primeiro
UPDATE users 
SET user_photo = NULL 
WHERE cpf = '98765432100';

-- Verificar se foi limpa
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
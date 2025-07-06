-- Adiciona colunas faltantes na tabela groups
ALTER TABLE groups
ADD COLUMN descricao TEXT,
ADD COLUMN tipo VARCHAR(50),
ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

-- Renomeia colunas para manter compatibilidade com o modelo Python
ALTER TABLE groups 
RENAME COLUMN name TO nome;

ALTER TABLE groups 
RENAME COLUMN created_at TO data_criacao;

ALTER TABLE groups 
RENAME COLUMN updated_at TO data_atualizacao; 
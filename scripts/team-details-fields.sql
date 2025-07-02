-- Script para adicionar campos extras à tabela teams
-- Execute no SQL Editor do Supabase

-- Adicionar novos campos à tabela teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS tipo_negocio VARCHAR(100);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS endereco TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS website VARCHAR(255);

-- Verificar se foi adicionado corretamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'teams' 
ORDER BY ordinal_position;

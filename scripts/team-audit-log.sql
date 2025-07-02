-- Script para criar tabela de auditoria de ações da equipa (OPCIONAL)
-- Execute no SQL Editor do Supabase se quiser tracking de ações

-- Criar tabela de auditoria
CREATE TABLE IF NOT EXISTS team_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'member_removed', 'member_added', 'role_changed', etc.
    target_user_id UUID, -- ID do usuário que foi afetado pela ação
    details JSONB, -- Detalhes extras da ação
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_team_audit_log_team_id ON team_audit_log(team_id);
CREATE INDEX IF NOT EXISTS idx_team_audit_log_created_at ON team_audit_log(created_at);

-- Função para registar remoção de membro (OPCIONAL)
-- Pode ser usada no futuro para tracking avançado
CREATE OR REPLACE FUNCTION log_member_removal()
RETURNS TRIGGER AS $$
BEGIN
    -- Apenas logar se team_id mudou de valor para NULL
    IF OLD.team_id IS NOT NULL AND NEW.team_id IS NULL THEN
        INSERT INTO team_audit_log (
            team_id,
            user_id,
            action,
            target_user_id,
            details
        ) VALUES (
            OLD.team_id,
            auth.uid(), -- Usuário que fez a ação
            'member_removed',
            OLD.id,
            jsonb_build_object(
                'member_name', OLD.nome,
                'member_email', OLD.email,
                'member_role', OLD.role
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentar a linha abaixo se não quiser auditoria automática
-- CREATE TRIGGER trigger_member_removal AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION log_member_removal();

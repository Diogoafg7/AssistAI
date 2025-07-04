-- SCRIPT COMPLETO E DEFINITIVO - Execute este uma vez para configurar tudo
-- Execute no SQL Editor do Supabase

-- ========================================
-- PARTE 1: LIMPEZA COMPLETA
-- ========================================

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;
DROP POLICY IF EXISTS "Users can view their own team" ON teams;
DROP POLICY IF EXISTS "Chefes can create teams" ON teams;
DROP POLICY IF EXISTS "Chefes can update their teams" ON teams;
DROP POLICY IF EXISTS "Team members can view team reservas" ON reservas;
DROP POLICY IF EXISTS "Chefes can manage team reservas" ON reservas;
DROP POLICY IF EXISTS "Team members can view team tarefas" ON tarefas;
DROP POLICY IF EXISTS "Chefes can manage team tarefas" ON tarefas;
DROP POLICY IF EXISTS "Users can manage their personal tasks" ON personal_tasks;
DROP POLICY IF EXISTS "Team members can view team horarios" ON horarios;
DROP POLICY IF EXISTS "Chefes can manage team horarios" ON horarios;

-- Remover triggers e funções
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS create_user_profile(UUID, TEXT, TEXT, user_role);
DROP FUNCTION IF EXISTS create_user_profile_if_needed();
DROP FUNCTION IF EXISTS create_recurring_tasks();

-- Remover todas as tabelas (CASCADE para remover dependências)
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS personal_tasks CASCADE;
DROP TABLE IF EXISTS tarefas CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Remover tipos personalizados
DROP TYPE IF EXISTS task_recurrence CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ========================================
-- PARTE 2: CRIAR TIPOS PERSONALIZADOS
-- ========================================

CREATE TYPE user_role AS ENUM ('chefe', 'empregado');
CREATE TYPE task_recurrence AS ENUM ('unica', 'diaria', 'semanal', 'mensal');

-- ========================================
-- PARTE 3: CRIAR TABELAS
-- ========================================

-- Tabela users (perfil dos utilizadores)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255),
  role user_role NOT NULL DEFAULT 'empregado',
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela teams
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  chefe_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar foreign key para team_id em users
ALTER TABLE users ADD CONSTRAINT fk_users_team_id 
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Tabela reservas
CREATE TABLE reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  cliente_nome VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  hora TIME,
  notas TEXT,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela tarefas
CREATE TABLE tarefas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  recorrencia task_recurrence DEFAULT 'unica',
  atribuido_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela personal_tasks
CREATE TABLE personal_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela horarios
CREATE TABLE horarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  dia_da_semana INTEGER NOT NULL CHECK (dia_da_semana >= 0 AND dia_da_semana <= 6),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  semana_inicio DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PARTE 4: SEM TRIGGER AUTOMÁTICO (para evitar erros)
-- ========================================

-- NÃO criar trigger automático por enquanto
-- O perfil será criado manualmente quando necessário

-- Função auxiliar para criar perfil quando necessário (chamada manualmente)
CREATE OR REPLACE FUNCTION create_user_profile_manual(
  user_id UUID, 
  user_email TEXT, 
  user_nome TEXT DEFAULT '', 
  user_role user_role DEFAULT 'empregado'
)
RETURNS void AS $$
BEGIN
  INSERT INTO users (id, email, nome, role)
  VALUES (user_id, user_email, user_nome, user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = EXCLUDED.nome,
    role = EXCLUDED.role,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- PARTE 5: DESATIVAR RLS TEMPORARIAMENTE
-- ========================================

-- Desativar RLS temporariamente para evitar problemas de políticas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas DISABLE ROW LEVEL SECURITY;
ALTER TABLE personal_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE horarios DISABLE ROW LEVEL SECURITY;

-- ========================================
-- PARTE 6: POLÍTICAS RLS (DESATIVADAS TEMPORARIAMENTE)
-- ========================================

-- Políticas comentadas por enquanto para evitar problemas
-- Serão ativadas numa versão futura quando tudo estiver estável

/*
-- Políticas para tabela users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view team members" ON users
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

-- Políticas para tabela teams
CREATE POLICY "Team members can view their team" ON teams
  FOR SELECT USING (
    chefe_user_id = auth.uid() OR 
    id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Chefes can create teams" ON teams
  FOR INSERT WITH CHECK (chefe_user_id = auth.uid());

CREATE POLICY "Chefes can update their teams" ON teams
  FOR UPDATE USING (chefe_user_id = auth.uid());

-- Políticas para tabela reservas
CREATE POLICY "Team members can view team reservas" ON reservas
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Chefes can manage team reservas" ON reservas
  FOR ALL USING (
    team_id IN (
      SELECT id FROM teams WHERE chefe_user_id = auth.uid()
    )
  );

-- Políticas para tabela tarefas
CREATE POLICY "Team members can view team tarefas" ON tarefas
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Chefes can manage team tarefas" ON tarefas
  FOR ALL USING (
    team_id IN (
      SELECT id FROM teams WHERE chefe_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update assigned tarefas" ON tarefas
  FOR UPDATE USING (atribuido_user_id = auth.uid());

-- Políticas para tabela personal_tasks
CREATE POLICY "Users can manage their personal tasks" ON personal_tasks
  FOR ALL USING (user_id = auth.uid());

-- Políticas para tabela horarios
CREATE POLICY "Team members can view team horarios" ON horarios
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Chefes can manage team horarios" ON horarios
  FOR ALL USING (
    team_id IN (
      SELECT id FROM teams WHERE chefe_user_id = auth.uid()
    )
  );
*/

-- ========================================
-- PARTE 7: FUNÇÕES AUXILIARES
-- ========================================

-- Função para criar tarefas recorrentes
CREATE OR REPLACE FUNCTION create_recurring_tasks()
RETURNS void AS $$
DECLARE
  task_record RECORD;
  next_date DATE;
BEGIN
  FOR task_record IN 
    SELECT * FROM tarefas 
    WHERE recorrencia != 'unica' 
    AND data <= CURRENT_DATE
    AND completed = true
  LOOP
    CASE task_record.recorrencia
      WHEN 'diaria' THEN
        next_date := task_record.data + INTERVAL '1 day';
      WHEN 'semanal' THEN
        next_date := task_record.data + INTERVAL '1 week';
      WHEN 'mensal' THEN
        next_date := task_record.data + INTERVAL '1 month';
    END CASE;
    
    INSERT INTO tarefas (
      team_id, titulo, descricao, data, recorrencia, 
      atribuido_user_id, created_by
    ) VALUES (
      task_record.team_id, task_record.titulo, task_record.descricao,
      next_date, task_record.recorrencia, task_record.atribuido_user_id,
      task_record.created_by
    );
    
    UPDATE tarefas SET data = next_date WHERE id = task_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS tipo_negocio VARCHAR(100);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS endereco TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS website VARCHAR(255);

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
-- Script para adicionar sistema de pedidos para entrar na equipa
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de pedidos para equipa
CREATE TABLE IF NOT EXISTS team_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceite', 'rejeitado')),
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Garantir que um user só pode ter um pedido pendente por equipa
  UNIQUE(team_id, user_id)
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE team_requests ENABLE ROW LEVEL SECURITY;

-- Política para utilizadores verem os seus próprios pedidos
CREATE POLICY "Users can view their own requests" ON team_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Política para utilizadores criarem pedidos
CREATE POLICY "Users can create team requests" ON team_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para chefes verem pedidos da sua equipa
CREATE POLICY "Team leaders can view team requests" ON team_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_requests.team_id 
      AND teams.chefe_user_id = auth.uid()
    )
  );

-- Política para chefes atualizarem pedidos da sua equipa
CREATE POLICY "Team leaders can update team requests" ON team_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_requests.team_id 
      AND teams.chefe_user_id = auth.uid()
    )
  );

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_team_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER team_requests_updated_at_trigger
  BEFORE UPDATE ON team_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_team_requests_updated_at();

-- Criar função para aceitar pedido de equipa
CREATE OR REPLACE FUNCTION accept_team_request(request_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  request_record team_requests%ROWTYPE;
  team_record teams%ROWTYPE;
BEGIN
  -- Obter o pedido
  SELECT * INTO request_record FROM team_requests WHERE id = request_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se o utilizador atual é o chefe da equipa
  SELECT * INTO team_record FROM teams WHERE id = request_record.team_id AND chefe_user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Atualizar o pedido para aceite
  UPDATE team_requests 
  SET 
    status = 'aceite',
    reviewed_at = NOW(),
    reviewed_by = auth.uid()
  WHERE id = request_id;
  
  -- Adicionar o utilizador à equipa
  UPDATE users 
  SET team_id = request_record.team_id
  WHERE id = request_record.user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar função para rejeitar pedido de equipa
CREATE OR REPLACE FUNCTION reject_team_request(request_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  request_record team_requests%ROWTYPE;
  team_record teams%ROWTYPE;
BEGIN
  -- Obter o pedido
  SELECT * INTO request_record FROM team_requests WHERE id = request_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se o utilizador atual é o chefe da equipa
  SELECT * INTO team_record FROM teams WHERE id = request_record.team_id AND chefe_user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Atualizar o pedido para rejeitado
  UPDATE team_requests 
  SET 
    status = 'rejeitado',
    reviewed_at = NOW(),
    reviewed_by = auth.uid()
  WHERE id = request_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

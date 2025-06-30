-- Teams policies
CREATE POLICY "Users can view their own team" ON teams
  FOR SELECT USING (
    chefe_user_id = auth.uid() OR 
    id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Chefes can create teams" ON teams
  FOR INSERT WITH CHECK (chefe_user_id = auth.uid());

CREATE POLICY "Chefes can update their teams" ON teams
  FOR UPDATE USING (chefe_user_id = auth.uid());

-- Users policies
CREATE POLICY "Users can view team members" ON users
  FOR SELECT USING (
    id = auth.uid() OR 
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Reservas policies
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

-- Tarefas policies
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

-- Personal tasks policies
CREATE POLICY "Users can manage their personal tasks" ON personal_tasks
  FOR ALL USING (user_id = auth.uid());

-- Horarios policies
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

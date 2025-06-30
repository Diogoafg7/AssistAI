-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to create recurring tasks
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

export type UserRole = "chefe" | "empregado"
export type TaskRecurrence = "unica" | "diaria" | "semanal" | "mensal"
export type TeamRequestStatus = "pendente" | "aceite" | "rejeitado"

export interface User {
  id: string
  email: string
  nome?: string
  role: UserRole
  team_id?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  nome: string
  chefe_user_id: string
  descricao?: string
  tipo_negocio?: string
  telefone?: string
  email?: string
  endereco?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Reserva {
  id: string
  team_id: string
  cliente_nome: string
  data: string
  hora?: string
  notas?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Tarefa {
  id: string
  team_id: string
  titulo: string
  descricao?: string
  data: string
  recorrencia: TaskRecurrence
  atribuido_user_id?: string
  created_by: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface PersonalTask {
  id: string
  user_id: string
  titulo: string
  descricao?: string
  data: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Horario {
  id: string
  team_id: string
  user_id: string
  dia_da_semana: number
  hora_inicio: string
  hora_fim: string
  semana_inicio: string
  created_at: string
  updated_at: string
}

export interface TeamRequest {
  id: string
  team_id: string
  user_id: string
  status: TeamRequestStatus
  mensagem?: string
  created_at: string
  updated_at: string
  reviewed_at?: string
  reviewed_by?: string
  // Dados relacionados (joins)
  user?: User
  team?: Team
  reviewed_by_user?: User
}

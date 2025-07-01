import { createClient } from "@/lib/supabase/server"
import type { User } from "@/types/database"

export async function ensureUserProfile(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  // Verificar se o perfil já existe
  const { data: existingProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single()

  if (existingProfile) {
    return existingProfile
  }

  // Se não existe, criar o perfil
  const nome = authUser.user_metadata?.nome || authUser.email?.split('@')[0] || ''
  const role = authUser.user_metadata?.role || 'empregado'

  const { data: newProfile, error } = await supabase
    .from("users")
    .insert({
      id: authUser.id,
      email: authUser.email!,
      nome,
      role,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }

  return newProfile
}

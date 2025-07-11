import { createClient } from "@/lib/supabase/server"
import type { User } from "@/types/database"
import { redirect } from "next/navigation"

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  // Tentar obter o perfil existente
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single()

  if (user) {
    return user
  }

  // Se não existe, criar automaticamente
  const nome = authUser.user_metadata?.nome || authUser.email?.split('@')[0] || ''
  const role = authUser.user_metadata?.role || 'empregado'

  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      id: authUser.id,
      email: authUser.email!,
      nome,
      role: role as 'chefe' | 'empregado',
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }

  return newUser
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function requireChefe() {
  const user = await requireAuth()

  if (user.role !== "chefe") {
    redirect("/dashboard")
  }

  return user
}

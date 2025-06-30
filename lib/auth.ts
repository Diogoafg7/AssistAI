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

  const { data: user } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  return user
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

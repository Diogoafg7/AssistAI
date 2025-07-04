import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ensureUserProfile } from "@/lib/ensure-profile"
import { TeamRequests } from "@/components/dashboard/team-requests"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default async function TeamRequestsPage() {
  const user = await ensureUserProfile()

  if (!user) {
    redirect("/auth/login")
  }

  // Verificar se é chefe
  if (user.role !== "chefe") {
    redirect("/dashboard")
  }

  // Verificar se tem equipa
  if (!user.team_id) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pedidos de Entrada</h1>
          <p className="text-gray-600">Gerir pedidos para entrar na sua equipa</p>
        </div>

        <TeamRequests user={user} />
      </div>
    </DashboardLayout>
  )
}

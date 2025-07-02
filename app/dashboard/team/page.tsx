import { requireAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TeamMembersList } from "@/components/dashboard/team-members-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default async function TeamMembersPage() {
  const user = await requireAuth()

  if (!user.team_id) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <CardTitle>Sem Equipa</CardTitle>
              <CardDescription>
                Precisa de estar numa equipa para ver os membros.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/dashboard">Voltar ao Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Buscar informações da equipa
  const supabase = await createClient()
  
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", user.team_id)
    .single()

  // Buscar todos os membros da equipa
  const { data: members } = await supabase
    .from("users")
    .select("*")
    .eq("team_id", user.team_id)
    .order("role", { ascending: false }) // Chefes primeiro
    .order("nome", { ascending: true })

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Equipa</h1>
            <p className="text-gray-600">
              {team?.nome || "Gerir membros da equipa"}
            </p>
          </div>
          
          {user.role === "chefe" && (
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline">
                <Link href="/dashboard/team/edit">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Equipa
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/team/invite">
                  <Plus className="h-4 w-4 mr-2" />
                  Convidar Membro
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Estatísticas da Equipa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chefes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members?.filter(m => m.role === "chefe").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empregados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members?.filter(m => m.role === "empregado").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Membros */}
        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipa</CardTitle>
            <CardDescription>
              Lista de todos os membros da {team?.nome}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMembersList 
              members={members || []} 
              currentUser={user}
              team={team}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

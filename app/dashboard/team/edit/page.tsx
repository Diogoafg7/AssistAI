import { requireAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EditTeamForm } from "@/components/dashboard/edit-team-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function EditTeamPage() {
  const user = await requireAuth()

  // Verificar se o utilizador é chefe
  if (user.role !== "chefe") {
    redirect("/dashboard")
  }

  if (!user.team_id) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <CardTitle>Sem Equipa</CardTitle>
              <CardDescription>
                Precisa de criar uma equipa primeiro para editar as informações.
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
  
  const { data: team, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", user.team_id)
    .eq("chefe_user_id", user.id) // Verificar se é realmente o chefe desta equipa
    .single()

  if (error || !team) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <CardTitle>Acesso Negado</CardTitle>
              <CardDescription>
                Apenas o chefe da equipa pode editar estas informações.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/dashboard/team">Voltar à Equipa</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Equipa</h1>
            <p className="text-gray-600">
              Alterar informações e configurações da equipa
            </p>
          </div>
        </div>

        {/* Formulário de Edição */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Informações da Equipa</span>
              </CardTitle>
              <CardDescription>
                Atualize os detalhes da sua equipa. Estas informações são visíveis para todos os membros.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditTeamForm team={team} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

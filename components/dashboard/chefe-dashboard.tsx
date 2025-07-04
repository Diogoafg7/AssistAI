import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ClipboardList, Clock, UserPlus } from "lucide-react"
import type { User } from "@/types/database"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { PendingRequestsAlert } from "@/components/dashboard/pending-requests-alert"

interface ChefeDashboardProps {
  user: User
}

export function ChefeDashboard({ user }: ChefeDashboardProps) {
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Chefe</h1>
          <p className="text-gray-600">Gerir a sua equipa e operações</p>
        </div>

        {/* Alerta de pedidos pendentes */}
        <PendingRequestsAlert user={user} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/team" className="block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipa</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Membros ativos</p>
              </CardContent>
            </Link>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horários</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">40h</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerir a sua equipa e operações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link href="/dashboard/reservas">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gerir Reservas
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/dashboard/tarefas">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Atribuir Tarefas
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/dashboard/horarios">
                  <Clock className="mr-2 h-4 w-4" />
                  Planear Horários
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/dashboard/equipa">
                  <Users className="mr-2 h-4 w-4" />
                  Gerir Equipa
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Reservas</CardTitle>
              <CardDescription>Reservas para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-gray-600">Hoje, 14:00</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maria Santos</p>
                    <p className="text-sm text-gray-600">Amanhã, 10:30</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pedro Costa</p>
                    <p className="text-sm text-gray-600">Sexta, 16:00</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ClipboardList, Clock, CheckCircle } from "lucide-react"
import type { User } from "@/types/database"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MyTeamRequests } from "@/components/dashboard/my-team-requests"

interface EmpregadoDashboardProps {
  user: User
}

export function EmpregadoDashboard({ user }: EmpregadoDashboardProps) {
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">O Meu Dashboard</h1>
          <p className="text-gray-600">Veja as suas tarefas, horários e reservas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Hoje</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Hoje</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8h</div>
              <p className="text-xs text-muted-foreground">09:00 - 17:00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Mostrar pedidos de equipa se existirem */}
        <MyTeamRequests user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas de Hoje</CardTitle>
              <CardDescription>As suas tarefas para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Preparar relatório mensal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="line-through text-gray-500">Verificar emails</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Reunião com cliente às 15:00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="line-through text-gray-500">Atualizar base de dados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horário da Semana</CardTitle>
              <CardDescription>O seu horário para esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Segunda</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Terça</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Quarta</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Quinta</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sexta</span>
                  <span>09:00 - 17:00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

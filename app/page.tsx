import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, ClipboardList, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Gestão de Equipas</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simplifique a gestão da sua equipa com uma plataforma completa para horários, tarefas e reservas.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/auth/register">Começar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Gestão de Equipas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Organize a sua equipa e defina roles para cada membro</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Gerir reservas de clientes de forma simples e eficiente</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Atribuir e acompanhar tarefas com sistema de recorrência</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Horários</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Planear horários semanais para toda a equipa</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pronto para começar?</h2>
          <p className="text-lg text-gray-600 mb-8">Junte-se a centenas de equipas que já usam a nossa plataforma</p>
          <Button asChild size="lg">
            <Link href="/auth/register">Criar Conta Gratuita</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

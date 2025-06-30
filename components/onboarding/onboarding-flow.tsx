"use client"

import { useState } from "react"
import type { User } from "@/types/database"
import { CreateTeamForm } from "./create-team-form"
import { JoinTeamForm } from "./join-team-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus } from "lucide-react"

interface OnboardingFlowProps {
  user: User
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const [step, setStep] = useState<"choose" | "create" | "join">("choose")

  if (step === "create") {
    return <CreateTeamForm user={user} onBack={() => setStep("choose")} />
  }

  if (step === "join") {
    return <JoinTeamForm user={user} onBack={() => setStep("choose")} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Bem-vindo!</h1>
          <p className="text-gray-600 mt-2">Para começar, precisa de criar uma equipa ou juntar-se a uma existente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStep("create")}>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-blue-600" />
              <CardTitle>Criar Equipa</CardTitle>
              <CardDescription>Crie uma nova equipa e convide membros para se juntarem</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Criar Nova Equipa</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStep("join")}>
            <CardHeader className="text-center">
              <UserPlus className="h-12 w-12 mx-auto text-green-600" />
              <CardTitle>Juntar-se a Equipa</CardTitle>
              <CardDescription>Junte-se a uma equipa existente usando um código de convite</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Juntar-se a Equipa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

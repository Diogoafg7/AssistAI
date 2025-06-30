"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import type { User } from "@/types/database"
import { createClient } from "@/lib/supabase/client"

interface JoinTeamFormProps {
  user: User
  onBack: () => void
}

export function JoinTeamForm({ user, onBack }: JoinTeamFormProps) {
  const [teamCode, setTeamCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()

    try {
      // Procurar a equipa pelo código (usando o ID da equipa como código por simplicidade)
      const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", teamCode).single()

      if (teamError || !team) {
        throw new Error("Código de equipa inválido")
      }

      // Atualizar o utilizador para se juntar à equipa
      const { error: userError } = await supabase
        .from("users")
        .update({
          team_id: team.id,
        })
        .eq("id", user.id)

      if (userError) throw userError

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Juntar-se a Equipa</CardTitle>
              <CardDescription>Introduza o código da equipa para se juntar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="teamCode">Código da Equipa</Label>
              <Input
                id="teamCode"
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                placeholder="Introduza o código da equipa"
                required
              />
              <p className="text-xs text-gray-500">Peça o código da equipa ao seu chefe</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A juntar..." : "Juntar-se à Equipa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

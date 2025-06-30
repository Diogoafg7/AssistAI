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

interface CreateTeamFormProps {
  user: User
  onBack: () => void
}

export function CreateTeamForm({ user, onBack }: CreateTeamFormProps) {
  const [teamName, setTeamName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()

    try {
      // Criar a equipa
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          nome: teamName,
          chefe_user_id: user.id,
        })
        .select()
        .single()

      if (teamError) throw teamError

      // Atualizar o utilizador para ser chefe e associar à equipa
      const { error: userError } = await supabase
        .from("users")
        .update({
          role: "chefe",
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
              <CardTitle>Criar Equipa</CardTitle>
              <CardDescription>Crie uma nova equipa para gerir</CardDescription>
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
              <Label htmlFor="teamName">Nome da Equipa</Label>
              <Input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ex: Equipa de Vendas"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A criar..." : "Criar Equipa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

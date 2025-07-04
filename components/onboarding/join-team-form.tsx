"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const supabase = createClient()

    try {
      // Procurar a equipa pelo código (usando o ID da equipa como código por simplicidade)
      const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", teamCode).single()

      if (teamError || !team) {
        throw new Error("Código de equipa inválido")
      }

      // Verificar se já existe um pedido pendente
      const { data: existingRequest } = await supabase
        .from("team_requests")
        .select("*")
        .eq("team_id", team.id)
        .eq("user_id", user.id)
        .eq("status", "pendente")
        .single()

      if (existingRequest) {
        throw new Error("Já tem um pedido pendente para esta equipa")
      }

      // Criar o pedido para entrar na equipa
      const { error: requestError } = await supabase.from("team_requests").insert({
        team_id: team.id,
        user_id: user.id,
        mensagem: message.trim() || null,
        status: "pendente",
      })

      if (requestError) throw requestError

      setSuccess(true)
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
              <CardTitle>Pedir para Entrar na Equipa</CardTitle>
              <CardDescription>
                {success
                  ? "Pedido enviado com sucesso!"
                  : "Introduza o código da equipa e uma mensagem opcional"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  O seu pedido foi enviado para o chefe da equipa. Será notificado quando for aceite ou rejeitado.
                </AlertDescription>
              </Alert>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={() => router.push("/dashboard")} className="flex-1">
                  Ir para Dashboard
                </Button>
              </div>
            </div>
          ) : (
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

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Apresente-se ou deixe uma mensagem para o chefe da equipa..."
                  rows={3}
                />
                <p className="text-xs text-gray-500">Esta mensagem será vista pelo chefe da equipa</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A enviar pedido..." : "Enviar Pedido"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

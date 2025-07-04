"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Check, X, Send } from "lucide-react"
import type { TeamRequest, User } from "@/types/database"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MyTeamRequestsProps {
  user: User
}

export function MyTeamRequests({ user }: MyTeamRequestsProps) {
  const [requests, setRequests] = useState<TeamRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadMyRequests()
  }, [user.id])

  const loadMyRequests = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("team_requests")
        .select(`
          *,
          team:teams!team_requests_team_id_fkey(id, nome)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      case "aceite":
        return <Badge variant="outline" className="text-green-600 border-green-300"><Check className="w-3 h-3 mr-1" />Aceite</Badge>
      case "rejeitado":
        return <Badge variant="outline" className="text-red-600 border-red-300"><X className="w-3 h-3 mr-1" />Rejeitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusDescription = (request: TeamRequest) => {
    switch (request.status) {
      case "pendente":
        return `Enviado há ${formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}`
      case "aceite":
        return `Aceite há ${formatDistanceToNow(new Date(request.reviewed_at!), { addSuffix: true, locale: ptBR })}`
      case "rejeitado":
        return `Rejeitado há ${formatDistanceToNow(new Date(request.reviewed_at!), { addSuffix: true, locale: ptBR })}`
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Meus Pedidos
          </CardTitle>
          <CardDescription>A carregar pedidos...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (requests.length === 0) {
    return null // Não mostrar se não houver pedidos
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Meus Pedidos de Entrada
        </CardTitle>
        <CardDescription>
          Estado dos seus pedidos para entrar em equipas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{request.team?.nome || "Equipa"}</h4>
                    {getStatusBadge(request.status)}
                  </div>
                  {request.mensagem && (
                    <p className="text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded border">
                      "{request.mensagem}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {getStatusDescription(request)}
                  </p>
                  {request.status === "aceite" && (
                    <Alert className="mt-3 border-green-200 bg-green-50">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Parabéns! O seu pedido foi aceite. Agora faz parte da equipa "{request.team?.nome}".
                      </AlertDescription>
                    </Alert>
                  )}
                  {request.status === "rejeitado" && (
                    <Alert className="mt-3 border-red-200 bg-red-50">
                      <X className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        O seu pedido foi rejeitado. Pode tentar contactar o chefe da equipa para mais informações.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Check, X, Clock, Users, Mail } from "lucide-react"
import type { TeamRequest, User } from "@/types/database"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TeamRequestsProps {
  user: User
}

export function TeamRequests({ user }: TeamRequestsProps) {
  const [requests, setRequests] = useState<TeamRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadTeamRequests()
  }, [user.team_id])

  const loadTeamRequests = async () => {
    if (!user.team_id) return

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("team_requests")
        .select(`
          *,
          user:users!team_requests_user_id_fkey(id, nome, email),
          team:teams!team_requests_team_id_fkey(id, nome)
        `)
        .eq("team_id", user.team_id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (requestId: string, action: "accept" | "reject") => {
    setProcessingId(requestId)
    setError("")

    const supabase = createClient()

    try {
      const functionName = action === "accept" ? "accept_team_request" : "reject_team_request"
      
      const { data, error } = await supabase.rpc(functionName, {
        request_id: requestId,
      })

      if (error) throw error

      if (!data) {
        throw new Error("Não foi possível processar o pedido")
      }

      // Recarregar os pedidos
      await loadTeamRequests()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessingId(null)
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

  const pendingRequests = requests.filter(r => r.status === "pendente")
  const processedRequests = requests.filter(r => r.status !== "pendente")

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Pedidos de Entrada
          </CardTitle>
          <CardDescription>A carregar pedidos...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Pedidos de Entrada na Equipa
          {pendingRequests.length > 0 && (
            <Badge variant="outline" className="ml-2 text-yellow-600 border-yellow-300">
              {pendingRequests.length} pendente{pendingRequests.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Gerir pedidos de novos membros para a sua equipa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">
              Ainda não há pedidos para entrar na sua equipa.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pedidos Pendentes */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-yellow-600">
                  Pedidos Pendentes ({pendingRequests.length})
                </h3>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{request.user?.nome || "Utilizador"}</h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Mail className="w-4 h-4 mr-1" />
                            {request.user?.email}
                          </div>
                          {request.mensagem && (
                            <p className="text-sm text-gray-700 mb-3 p-2 bg-white rounded border">
                              "{request.mensagem}"
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Pedido enviado há {formatDistanceToNow(new Date(request.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            onClick={() => handleRequest(request.id, "accept")}
                            disabled={processingId === request.id}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleRequest(request.id, "reject")}
                            disabled={processingId === request.id}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Separador se houver pedidos pendentes e processados */}
            {pendingRequests.length > 0 && processedRequests.length > 0 && (
              <Separator />
            )}

            {/* Pedidos Processados */}
            {processedRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-600">
                  Histórico ({processedRequests.length})
                </h3>
                <div className="space-y-3">
                  {processedRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{request.user?.nome || "Utilizador"}</h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Mail className="w-4 h-4 mr-1" />
                            {request.user?.email}
                          </div>
                          {request.mensagem && (
                            <p className="text-sm text-gray-700 mb-2 p-2 bg-white rounded border">
                              "{request.mensagem}"
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {request.status === "aceite" ? "Aceite" : "Rejeitado"} há{" "}
                            {formatDistanceToNow(new Date(request.reviewed_at!), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

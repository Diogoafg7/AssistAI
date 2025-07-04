"use client"

import React, { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Bell } from "lucide-react"
import type { User } from "@/types/database"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface PendingRequestsAlertProps {
  user: User
}

export function PendingRequestsAlert({ user }: PendingRequestsAlertProps) {
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPendingRequests()
  }, [user.team_id])

  const loadPendingRequests = async () => {
    if (!user.team_id || user.role !== "chefe") {
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { count, error } = await supabase
        .from("team_requests")
        .select("*", { count: "exact", head: true })
        .eq("team_id", user.team_id)
        .eq("status", "pendente")

      if (error) throw error

      setPendingCount(count || 0)
    } catch (err) {
      console.error("Erro ao carregar pedidos pendentes:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || pendingCount === 0 || user.role !== "chefe") {
    return null
  }

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Bell className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-blue-800">
            Tem{" "}
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              {pendingCount}
            </Badge>{" "}
            novo{pendingCount !== 1 ? "s" : ""} pedido{pendingCount !== 1 ? "s" : ""} para entrar na equipa
          </span>
        </div>
        <Link href="/dashboard/team/requests">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-1" />
            Ver Pedidos
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  )
}

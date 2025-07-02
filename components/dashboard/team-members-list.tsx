"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MoreHorizontal, Mail, Calendar, Trash2, UserCog, Users } from "lucide-react"
import type { User, Team } from "@/types/database"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface TeamMembersListProps {
  members: User[]
  currentUser: User
  team: Team | null
}

export function TeamMembersList({ members, currentUser, team }: TeamMembersListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (memberId === currentUser.id) {
      toast({
        title: "Erro",
        description: "Não pode remover-se a si mesmo da equipa.",
        variant: "destructive",
      })
      return
    }

    // Verificar se é o último chefe da equipa
    const memberToRemove = members.find(m => m.id === memberId)
    const chefes = members.filter(m => m.role === "chefe")
    
    if (memberToRemove?.role === "chefe" && chefes.length === 1) {
      toast({
        title: "Erro",
        description: "Não pode remover o último chefe da equipa. Promova outro membro primeiro.",
        variant: "destructive",
      })
      return
    }

    setLoading(memberId)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("users")
        .update({ team_id: null })
        .eq("id", memberId)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: `${memberName} foi removido da equipa.`,
      })
      
      router.refresh()
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Erro",
        description: "Falha ao remover membro da equipa.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "chefe":
        return "bg-blue-100 text-blue-800"
      case "empregado":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro encontrado</h3>
        <p className="text-gray-500">Esta equipa ainda não tem membros.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card 
          key={member.id} 
          className={`hover:shadow-md transition-all duration-200 ${
            loading === member.id ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(member.nome || member.email)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">
                      {member.nome || "Sem nome"}
                    </h3>
                    {member.id === currentUser.id && (
                      <Badge variant="outline" className="text-xs">Você</Badge>
                    )}
                    {loading === member.id && (
                      <Badge variant="destructive" className="text-xs">Removendo...</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Desde {formatDate(member.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge className={getRoleColor(member.role)}>
                  {member.role === "chefe" ? "Chefe" : "Empregado"}
                </Badge>

                {currentUser.role === "chefe" && member.id !== currentUser.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <UserCog className="h-4 w-4 mr-2" />
                        Editar Role
                      </DropdownMenuItem>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover da Equipa
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover membro da equipa?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                              <p>
                                Tem a certeza que quer remover <strong>{member.nome || member.email}</strong> da equipa?
                              </p>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
                                <p className="text-sm text-yellow-800">
                                  <strong>O que acontece:</strong>
                                </p>
                                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                                  <li>• O membro perderá acesso a esta equipa</li>
                                  <li>• Poderá criar nova equipa ou juntar-se a outra</li>
                                  <li>• Histórico de atividades será mantido</li>
                                </ul>
                              </div>
                              <p className="text-sm text-gray-600 mt-3">
                                Esta ação não pode ser desfeita.
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveMember(member.id, member.nome || member.email)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={loading === member.id}
                            >
                              {loading === member.id ? "A remover..." : "Remover"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

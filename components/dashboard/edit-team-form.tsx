"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Building2, Phone, Mail, MapPin, Globe, FileText } from "lucide-react"
import type { Team } from "@/types/database"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface EditTeamFormProps {
  team: Team
}

export function EditTeamForm({ team }: EditTeamFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: team.nome || "",
    descricao: team.descricao || "",
    tipo_negocio: team.tipo_negocio || "",
    telefone: team.telefone || "",
    email: team.email || "",
    endereco: team.endereco || "",
    website: team.website || "",
  })
  const router = useRouter()

  const tiposNegocio = [
    "restaurante",
    "cafe",
    "bar",
    "clinica",
    "consultorio",
    "salao",
    "oficina",
    "loja",
    "hotel",
    "servicos",
    "outro"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("teams")
        .update({
          nome: formData.nome,
          descricao: formData.descricao || null,
          tipo_negocio: formData.tipo_negocio || null,
          telefone: formData.telefone || null,
          email: formData.email || null,
          endereco: formData.endereco || null,
          website: formData.website || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", team.id)

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Informações da equipa atualizadas com sucesso.",
      })

      router.push("/dashboard/team")
      router.refresh()
    } catch (error) {
      console.error("Error updating team:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar informações da equipa.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <h3 className="text-lg font-medium">Informações Básicas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Equipa *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Ex: Restaurante Central"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_negocio">Tipo de Negócio</Label>
            <Select
              value={formData.tipo_negocio}
              onValueChange={(value) => handleInputChange("tipo_negocio", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposNegocio.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            placeholder="Descreva brevemente o seu negócio..."
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Informações de Contacto */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <h3 className="text-lg font-medium">Contactos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange("telefone", e.target.value)}
              placeholder="Ex: +351 123 456 789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Ex: contato@empresa.pt"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Textarea
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleInputChange("endereco", e.target.value)}
            placeholder="Rua, número, código postal, cidade..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            placeholder="Ex: https://www.empresa.pt"
          />
        </div>
      </div>

      <Separator />

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/team")}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button type="submit" disabled={loading}>
          {loading ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </div>
    </form>
  )
}

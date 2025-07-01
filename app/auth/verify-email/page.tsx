import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <CardTitle>Verificar Email</CardTitle>
          <CardDescription>
            Enviámos um link de verificação para o seu email. 
            Clique no link para ativar a sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Não recebeu o email? Verifique a pasta de spam.
          </p>
          <Button asChild variant="outline">
            <Link href="/auth/login">Voltar ao Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

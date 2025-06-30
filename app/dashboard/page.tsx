import { requireAuth } from "@/lib/auth"
import { ChefeDashboard } from "@/components/dashboard/chefe-dashboard"
import { EmpregadoDashboard } from "@/components/dashboard/empregado-dashboard"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

export default async function DashboardPage() {
  const user = await requireAuth()

  // Se o utilizador não tem equipa, mostrar onboarding
  if (!user.team_id) {
    return <OnboardingFlow user={user} />
  }

  // Mostrar dashboard baseado no role
  if (user.role === "chefe") {
    return <ChefeDashboard user={user} />
  }

  return <EmpregadoDashboard user={user} />
}

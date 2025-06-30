import type React from "react"
import type { User } from "@/types/database"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <div className="flex">
        <DashboardSidebar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

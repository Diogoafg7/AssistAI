"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@/types/database"
import { Home, Calendar, ClipboardList, Clock, Users, Settings } from "lucide-react"

interface DashboardSidebarProps {
  user: User
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const chefeNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/reservas", label: "Reservas", icon: Calendar },
    { href: "/dashboard/tarefas", label: "Tarefas", icon: ClipboardList },
    { href: "/dashboard/horarios", label: "Horários", icon: Clock },
    { href: "/dashboard/equipa", label: "Equipa", icon: Users },
    { href: "/dashboard/settings", label: "Definições", icon: Settings },
  ]

  const empregadoNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/minhas-tarefas", label: "Minhas Tarefas", icon: ClipboardList },
    { href: "/dashboard/meu-horario", label: "Meu Horário", icon: Clock },
    { href: "/dashboard/reservas", label: "Reservas", icon: Calendar },
    { href: "/dashboard/settings", label: "Definições", icon: Settings },
  ]

  const navItems = user.role === "chefe" ? chefeNavItems : empregadoNavItems

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

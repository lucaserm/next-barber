"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { usePermissions } from "@/lib/hooks/use-permissions"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isChecking } = usePermissions()

  // Login page doesn't need layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Mostrar loading enquanto verifica permissões
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { useStore } from "@/lib/store"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useStore()

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, pathname, router])

  // Login page doesn't need layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Protected pages
  if (!isAuthenticated) {
    return null
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

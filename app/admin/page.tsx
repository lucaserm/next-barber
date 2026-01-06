"use client"

import { StatsCards } from "@/components/admin/stats-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { ServicesChart } from "@/components/admin/services-chart"
import { TodayAppointments } from "@/components/admin/today-appointments"
import { useStore } from "@/lib/store"

export default function AdminDashboardPage() {
  const { user } = useStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">Aqui está o resumo do seu negócio</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ServicesChart />
      </div>

      <TodayAppointments />
    </div>
  )
}

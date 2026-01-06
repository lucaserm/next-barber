"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, Users, TrendingUp, TrendingDown, Wallet } from "@/components/icons"
import { dashboardStats } from "@/lib/mock-data"

export function StatsCards() {
  const stats = [
    {
      title: "Receita do Mês",
      value: `R$ ${dashboardStats.totalRevenue.toLocaleString("pt-BR")}`,
      change: dashboardStats.revenueGrowth,
      icon: DollarSign,
    },
    {
      title: "Agendamentos",
      value: dashboardStats.totalAppointments.toString(),
      change: dashboardStats.appointmentsGrowth,
      icon: Calendar,
    },
    {
      title: "Clientes Ativos",
      value: dashboardStats.totalClients.toString(),
      change: 5.2,
      icon: Users,
    },
    {
      title: "Ticket Médio",
      value: `R$ ${dashboardStats.averageTicket.toFixed(2)}`,
      change: 3.1,
      icon: Wallet,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {stat.change >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{stat.change}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-red-500">{stat.change}%</span>
                </>
              )}
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

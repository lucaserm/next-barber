"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, TrendingUp, Calendar, Users, Download } from "@/components/icons"
import { useStore } from "@/lib/store"
import { revenueData, serviceStats } from "@/lib/mock-data"

export default function FinanceiroPage() {
  const { appointments } = useStore()
  const [period, setPeriod] = useState("month")

  const completedAppointments = appointments.filter((a) => a.status === "completed")

  const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.servicePrice, 0)
  const totalAppointments = completedAppointments.length
  const averageTicket = totalAppointments > 0 ? totalRevenue / totalAppointments : 0

  // Receita por barbeiro
  const revenueByBarber = completedAppointments.reduce(
    (acc, a) => {
      if (!acc[a.barberName]) {
        acc[a.barberName] = { name: a.barberName, revenue: 0, count: 0 }
      }
      acc[a.barberName].revenue += a.servicePrice
      acc[a.barberName].count += 1
      return acc
    },
    {} as Record<string, { name: string; revenue: number; count: number }>,
  )

  const barberData = Object.values(revenueByBarber)

  const pieColors = ["#d4a574", "#b8956a", "#9c8560", "#806556"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho financeiro da barbearia</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR")}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Atendimentos</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+8.3%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+3.1%</span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Barbeiros Ativos</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{barberData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Gerando receita</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>Receita mensal dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Receita",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$${value / 1000}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-chart-1)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue by Barber */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Barbeiro</CardTitle>
            <CardDescription>Distribuição da receita entre a equipe</CardDescription>
          </CardHeader>
          <CardContent>
            {barberData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Receita",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px] w-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={barberData}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                      >
                        {barberData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex-1 space-y-3">
                  {barberData.map((barber, index) => (
                    <div key={barber.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        />
                        <span className="text-sm">{barber.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ {barber.revenue.toLocaleString("pt-BR")}</p>
                        <p className="text-xs text-muted-foreground">{barber.count} atendimentos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nenhum dado disponível.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Receita por Serviço</CardTitle>
          <CardDescription>Performance de cada serviço oferecido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceStats.map((service, index) => {
              const maxRevenue = Math.max(...serviceStats.map((s) => s.revenue))
              const percentage = (service.revenue / maxRevenue) * 100
              return (
                <div key={service.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">R$ {service.revenue.toLocaleString("pt-BR")}</span>
                      <span className="text-muted-foreground ml-2">({service.count} atend.)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

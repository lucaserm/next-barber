"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Download, TrendingUp, Users, Calendar, DollarSign } from "@/components/icons"
import { useStore } from "@/lib/store"
import { revenueData, serviceStats } from "@/lib/mock-data"
import { toast } from "sonner"

export default function RelatoriosPage() {
  const { appointments, clients, barbers, services } = useStore()
  const [period, setPeriod] = useState("month")
  const [reportType, setReportType] = useState("general")

  const completedAppointments = appointments.filter((a) => a.status === "completed")
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled")

  // Stats
  const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.servicePrice, 0)
  const totalAppointments = appointments.length
  const completionRate = totalAppointments > 0 ? (completedAppointments.length / totalAppointments) * 100 : 0
  const cancellationRate = totalAppointments > 0 ? (cancelledAppointments.length / totalAppointments) * 100 : 0
  const averageTicket = completedAppointments.length > 0 ? totalRevenue / completedAppointments.length : 0

  // Dados por dia da semana
  const weekdayData = [
    { day: "Seg", appointments: 32, revenue: 2240 },
    { day: "Ter", appointments: 28, revenue: 1960 },
    { day: "Qua", appointments: 35, revenue: 2450 },
    { day: "Qui", appointments: 30, revenue: 2100 },
    { day: "Sex", appointments: 42, revenue: 2940 },
    { day: "Sáb", appointments: 48, revenue: 3360 },
  ]

  // Dados por horário
  const hourlyData = [
    { hour: "09:00", appointments: 12 },
    { hour: "10:00", appointments: 18 },
    { hour: "11:00", appointments: 22 },
    { hour: "14:00", appointments: 25 },
    { hour: "15:00", appointments: 28 },
    { hour: "16:00", appointments: 24 },
    { hour: "17:00", appointments: 30 },
    { hour: "18:00", appointments: 20 },
    { hour: "19:00", appointments: 15 },
  ]

  // Status distribution
  const statusData = [
    { name: "Concluídos", value: completedAppointments.length, color: "#22c55e" },
    { name: "Confirmados", value: appointments.filter((a) => a.status === "confirmed").length, color: "#3b82f6" },
    { name: "Pendentes", value: appointments.filter((a) => a.status === "pending").length, color: "#eab308" },
    { name: "Cancelados", value: cancelledAppointments.length, color: "#ef4444" },
  ]

  // Barber performance
  const barberPerformance = barbers.map((barber) => {
    const barberAppointments = completedAppointments.filter((a) => a.barberId === barber.id)
    const revenue = barberAppointments.reduce((sum, a) => sum + a.servicePrice, 0)
    return {
      name: barber.name,
      appointments: barberAppointments.length,
      revenue,
      averageTicket: barberAppointments.length > 0 ? revenue / barberAppointments.length : 0,
    }
  })

  // Client retention (mock data)
  const retentionData = [
    { month: "Jan", newClients: 15, returning: 45 },
    { month: "Fev", newClients: 18, returning: 52 },
    { month: "Mar", newClients: 22, returning: 58 },
    { month: "Abr", newClients: 12, returning: 62 },
    { month: "Mai", newClients: 20, returning: 68 },
    { month: "Jun", newClients: 25, returning: 72 },
  ]

  const handleExport = (type: string) => {
    toast.success(`Relatório de ${type} exportado com sucesso!`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análises detalhadas do seu negócio</p>
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Receita</span>
            </div>
            <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Agendamentos</span>
            </div>
            <p className="text-2xl font-bold">{totalAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Taxa Conclusão</span>
            </div>
            <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Clientes</span>
            </div>
            <p className="text-2xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Ticket Médio</span>
            </div>
            <p className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="barbers">Barbeiros</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Trend */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tendência de Receita</CardTitle>
                  <CardDescription>Receita mensal ao longo do tempo</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("receita")}>
                  <Download className="w-4 h-4 mr-1" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Receita", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickFormatter={(v) => `R$${v / 1000}k`}
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

            {/* Appointments by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status dos Agendamentos</CardTitle>
                <CardDescription>Distribuição por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <ChartContainer
                    config={{
                      value: { label: "Quantidade", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[200px] w-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex-1 space-y-3">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* By Weekday */}
            <Card>
              <CardHeader>
                <CardTitle>Movimento por Dia da Semana</CardTitle>
                <CardDescription>Agendamentos e receita por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    appointments: { label: "Agendamentos", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekdayData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="appointments" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* By Hour */}
            <Card>
              <CardHeader>
                <CardTitle>Horários de Pico</CardTitle>
                <CardDescription>Agendamentos por horário do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    appointments: { label: "Agendamentos", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="appointments" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance dos Serviços</CardTitle>
                <CardDescription>Análise detalhada de cada serviço</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport("serviços")}>
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-right">Atendimentos</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                    <TableHead className="text-right">% do Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceStats.map((service, index) => {
                    const totalServiceRevenue = serviceStats.reduce((sum, s) => sum + s.revenue, 0)
                    const percentage = ((service.revenue / totalServiceRevenue) * 100).toFixed(1)
                    return (
                      <TableRow key={service.name}>
                        <TableCell>
                          <Badge variant={index < 3 ? "default" : "secondary"}>{index + 1}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-right">{service.count}</TableCell>
                        <TableCell className="text-right">R$ {service.revenue.toLocaleString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary">
                              <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm">{percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Serviços</CardTitle>
              <CardDescription>Receita gerada por cada serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Receita", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `R$${v}`}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                      }
                    />
                    <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Barbers Tab */}
        <TabsContent value="barbers" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance dos Barbeiros</CardTitle>
                <CardDescription>Métricas individuais da equipe</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport("barbeiros")}>
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbeiro</TableHead>
                    <TableHead className="text-right">Atendimentos</TableHead>
                    <TableHead className="text-right">Receita Gerada</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barberPerformance.map((barber) => (
                    <TableRow key={barber.name}>
                      <TableCell className="font-medium">{barber.name}</TableCell>
                      <TableCell className="text-right">{barber.appointments}</TableCell>
                      <TableCell className="text-right">R$ {barber.revenue.toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="text-right">R$ {barber.averageTicket.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="default">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Atendimentos por Barbeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    appointments: { label: "Atendimentos", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barberPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="appointments" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Barbeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Receita", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barberPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickFormatter={(v) => `R$${v}`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                        }
                      />
                      <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Retenção de Clientes</CardTitle>
                  <CardDescription>Novos vs Retornantes</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("clientes")}>
                  <Download className="w-4 h-4 mr-1" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    newClients: { label: "Novos", color: "hsl(var(--chart-1))" },
                    returning: { label: "Retornantes", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={retentionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="newClients" name="Novos" fill="#d4a574" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="returning" name="Retornantes" fill="#9c8560" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clientes</CardTitle>
                <CardDescription>Clientes que mais geraram receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((client, index) => (
                      <div key={client.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Badge variant={index < 3 ? "default" : "secondary"}>{index + 1}</Badge>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.totalVisits} visitas</p>
                          </div>
                        </div>
                        <span className="font-bold">R$ {client.totalSpent.toLocaleString("pt-BR")}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Métricas de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold">{clients.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold">
                    {(clients.reduce((sum, c) => sum + c.totalVisits, 0) / clients.length || 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Média de Visitas</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold">
                    R$ {(clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length || 0).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">LTV Médio</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold">{(100 - cancellationRate).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

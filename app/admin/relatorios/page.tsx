"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Download, TrendingUp, Users, Calendar, DollarSign } from "@/components/icons"
import { useStats } from "@/lib/hooks/use-api"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/protected-route"

export default function RelatoriosPage() {
  return (
    <ProtectedRoute requiredPermission="VIEW_REPORTS">
      <RelatoriosContent />
    </ProtectedRoute>
  )
}

function RelatoriosContent() {
  const [period, setPeriod] = useState("month")
  const { data: stats, isLoading } = useStats(period)

  const handleExport = (type: string) => {
    toast.success(`Relatório de ${type} exportado com sucesso!`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    )
  }

  const statusData = [
    { name: "Concluídos", value: stats.statusStats.completed, color: "#22c55e" },
    { name: "Confirmados", value: stats.statusStats.confirmed, color: "#3b82f6" },
    { name: "Pendentes", value: stats.statusStats.pending, color: "#eab308" },
    { name: "Cancelados", value: stats.statusStats.cancelled, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada de desempenho</p>
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
          <Button variant="outline" onClick={() => handleExport("geral")}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Tudo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.summary.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Período selecionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agendamentos</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.totalAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.summary.completedAppointments} concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Dos agendamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Cancelamento</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.cancellationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Dos agendamentos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="patterns">Padrões</TabsTrigger>
        </TabsList>

        {/* Visão Geral Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <p className="text-sm text-muted-foreground">Status dos agendamentos</p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Quantidade",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita</CardTitle>
                <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Receita",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Desempenho Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Barbeiro</CardTitle>
              <p className="text-sm text-muted-foreground">Ranking de desempenho</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbeiro</TableHead>
                    <TableHead className="text-right">Atendimentos</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.revenueByBarber
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((barber, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{barber.name}</TableCell>
                        <TableCell className="text-right">{barber.count}</TableCell>
                        <TableCell className="text-right">R$ {barber.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {(barber.revenue / barber.count).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Populares</CardTitle>
              <p className="text-sm text-muted-foreground">Por número de atendimentos</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-right">Atendimentos</TableHead>
                    <TableHead className="text-right">Receita Total</TableHead>
                    <TableHead className="text-right">Preço Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.revenueByService
                    .sort((a, b) => b.count - a.count)
                    .map((service, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-right">{service.count}</TableCell>
                        <TableCell className="text-right">R$ {service.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {(service.revenue / service.count).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Padrões Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Weekday Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por Dia da Semana</CardTitle>
                <p className="text-sm text-muted-foreground">Padrão semanal</p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    appointments: {
                      label: "Agendamentos",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weekdayStats}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="appointments" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Hourly Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por Horário</CardTitle>
                <p className="text-sm text-muted-foreground">Horários mais movimentados</p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    appointments: {
                      label: "Agendamentos",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.hourlyStats}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hour" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="appointments" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análise de Padrões</CardTitle>
              <p className="text-sm text-muted-foreground">Insights e tendências</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Dia mais movimentado</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.weekdayStats.reduce((max, day) => (day.appointments > max.appointments ? day : max)).day} com{" "}
                      {stats.weekdayStats.reduce((max, day) => (day.appointments > max.appointments ? day : max)).appointments} agendamentos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20">
                  <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Horário de pico</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.hourlyStats.length > 0 &&
                        stats.hourlyStats.reduce((max, hour) => (hour.appointments > max.appointments ? hour : max)).hour}{" "}
                      com {stats.hourlyStats.length > 0 && stats.hourlyStats.reduce((max, hour) => (hour.appointments > max.appointments ? hour : max)).appointments}{" "}
                      agendamentos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20">
                  <DollarSign className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Serviço mais rentável</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.revenueByService.length > 0 &&
                        stats.revenueByService.reduce((max, service) => (service.revenue > max.revenue ? service : max)).name}{" "}
                      com R${" "}
                      {stats.revenueByService.length > 0 &&
                        stats.revenueByService.reduce((max, service) => (service.revenue > max.revenue ? service : max)).revenue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20">
                  <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Barbeiro destaque</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.revenueByBarber.length > 0 &&
                        stats.revenueByBarber.reduce((max, barber) => (barber.revenue > max.revenue ? barber : max)).name}{" "}
                      com R${" "}
                      {stats.revenueByBarber.length > 0 &&
                        stats.revenueByBarber.reduce((max, barber) => (barber.revenue > max.revenue ? barber : max)).revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

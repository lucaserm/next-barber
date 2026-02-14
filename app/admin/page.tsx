"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Clock,
} from "@/components/icons";
import { useStats, useAppointments } from "@/lib/hooks/use-api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProtectedRoute } from "@/components/protected-route";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredPermission="VIEW_DASHBOARD">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [period] = useState("month");
  const { data: stats, isLoading: statsLoading } = useStats(period);

  // Buscar agendamentos de hoje
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: todayAppointments = [], isLoading: appointmentsLoading } =
    useAppointments({
      date: today,
    });

  // Obter nome do usuário do localStorage
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  if (statsLoading || appointmentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Olá, {user?.name?.split(" ")[0] || "Admin"}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Aqui está o resumo do seu negócio
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Receita do Mês
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                R$ {stats.summary.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.summary.completedAppointments} atendimentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Agendamentos
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {stats.summary.totalAppointments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.summary.completionRate.toFixed(1)}% conclusão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Ticket Médio
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                R$ {stats.summary.averageTicket.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Por atendimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Hoje
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {todayAppointments.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Agendamentos</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Receita Mensal</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Últimos 6 meses</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Receita",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[250px] sm:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyRevenue}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
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

          {/* Services Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Serviços Mais Populares</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Por quantidade de atendimentos
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Atendimentos",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[250px] sm:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueByService.slice(0, 5)}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Agendamentos de Hoje</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum agendamento para hoje</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todayAppointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-card gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{appointment.clientName}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {appointment.service?.name} •{" "}
                        {appointment.barber?.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right">
                    <p className="font-semibold text-sm sm:text-base">{appointment.time}</p>
                    <Badge
                      variant={
                        appointment.status === "COMPLETED"
                          ? "default"
                          : appointment.status === "CONFIRMED"
                            ? "secondary"
                            : appointment.status === "PENDING"
                              ? "outline"
                              : "destructive"
                      }
                      className="text-xs"
                    >
                      {appointment.status === "COMPLETED"
                        ? "Concluído"
                        : appointment.status === "CONFIRMED"
                          ? "Confirmado"
                          : appointment.status === "PENDING"
                            ? "Pendente"
                            : "Cancelado"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

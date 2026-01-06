"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Check, X } from "@/components/icons"
import { useStore } from "@/lib/store"

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusLabels = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
}

export function TodayAppointments() {
  const { appointments, updateAppointment } = useStore()

  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time))

  const handleConfirm = (id: string) => {
    updateAppointment(id, { status: "confirmed" })
  }

  const handleCancel = (id: string) => {
    updateAppointment(id, { status: "cancelled" })
  }

  const handleComplete = (id: string) => {
    updateAppointment(id, { status: "completed" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos de Hoje</CardTitle>
        <CardDescription>
          {todayAppointments.length} agendamento{todayAppointments.length !== 1 ? "s" : ""} para hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todayAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-[60px]">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{appointment.time}</span>
                </div>

                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {appointment.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{appointment.clientName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {appointment.serviceName} • {appointment.barberName}
                  </p>
                </div>

                <Badge variant="outline" className={statusColors[appointment.status]}>
                  {statusLabels[appointment.status]}
                </Badge>

                {appointment.status === "pending" && (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleConfirm(appointment.id)}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}

                {appointment.status === "confirmed" && (
                  <Button size="sm" variant="outline" onClick={() => handleComplete(appointment.id)}>
                    Finalizar
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

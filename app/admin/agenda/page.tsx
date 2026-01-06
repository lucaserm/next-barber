"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Plus, Phone, Check, X, Trash2 } from "@/components/icons"
import { useStore } from "@/lib/store"
import { availableTimeSlots } from "@/lib/mock-data"
import { toast } from "sonner"
import { ptBR } from "date-fns/locale"

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

export default function AgendaPage() {
  const { appointments, barbers, services, addAppointment, updateAppointment, deleteAppointment } = useStore()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedBarber, setSelectedBarber] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    clientPhone: "",
    barberId: "",
    serviceId: "",
    time: "",
  })

  const dateStr = selectedDate.toISOString().split("T")[0]

  const filteredAppointments = appointments
    .filter((a) => {
      const matchesDate = a.date === dateStr
      const matchesBarber = selectedBarber === "all" || a.barberId === selectedBarber
      return matchesDate && matchesBarber
    })
    .sort((a, b) => a.time.localeCompare(b.time))

  const activeBarbers = barbers.filter((b) => b.active)
  const activeServices = services.filter((s) => s.active)

  const handleAddAppointment = () => {
    const barber = barbers.find((b) => b.id === newAppointment.barberId)
    const service = services.find((s) => s.id === newAppointment.serviceId)

    if (!barber || !service) return

    addAppointment({
      clientId: "",
      clientName: newAppointment.clientName,
      clientPhone: newAppointment.clientPhone,
      barberId: newAppointment.barberId,
      barberName: barber.name,
      serviceId: newAppointment.serviceId,
      serviceName: service.name,
      servicePrice: service.price,
      date: dateStr,
      time: newAppointment.time,
      status: "confirmed",
    })

    setIsDialogOpen(false)
    setNewAppointment({
      clientName: "",
      clientPhone: "",
      barberId: "",
      serviceId: "",
      time: "",
    })
    toast.success("Agendamento criado com sucesso!")
  }

  const getAvailableSlots = () => {
    if (!newAppointment.barberId) return availableTimeSlots

    const bookedTimes = appointments
      .filter((a) => a.date === dateStr && a.barberId === newAppointment.barberId && a.status !== "cancelled")
      .map((a) => a.time)

    return availableTimeSlots.filter((time) => !bookedTimes.includes(time))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos da barbearia</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar com Calendário e Filtros */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filtrar por Barbeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os barbeiros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os barbeiros</SelectItem>
                  {activeBarbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </CardTitle>
            <CardDescription>
              {filteredAppointments.length} agendamento{filteredAppointments.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Nenhum agendamento para esta data.</p>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 min-w-[70px]">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold">{appointment.time}</span>
                    </div>

                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {appointment.clientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{appointment.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.serviceName} • {appointment.barberName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Phone className="w-3 h-3" />
                        {appointment.clientPhone}
                      </div>
                    </div>

                    <Badge variant="outline" className={statusColors[appointment.status]}>
                      {statusLabels[appointment.status]}
                    </Badge>

                    <div className="flex gap-1">
                      {appointment.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => updateAppointment(appointment.id, { status: "confirmed" })}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => updateAppointment(appointment.id, { status: "cancelled" })}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointment(appointment.id, { status: "completed" })}
                        >
                          Finalizar
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          deleteAppointment(appointment.id)
                          toast.success("Agendamento removido")
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Novo Agendamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Agende um horário para {selectedDate.toLocaleDateString("pt-BR")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cliente</Label>
              <Input
                placeholder="Nome completo"
                value={newAppointment.clientName}
                onChange={(e) => setNewAppointment((prev) => ({ ...prev, clientName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                placeholder="(11) 99999-9999"
                value={newAppointment.clientPhone}
                onChange={(e) => setNewAppointment((prev) => ({ ...prev, clientPhone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Barbeiro</Label>
              <Select
                value={newAppointment.barberId}
                onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, barberId: value, time: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  {activeBarbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select
                value={newAppointment.serviceId}
                onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, serviceId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {activeServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - R$ {service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Horário</Label>
              <Select
                value={newAppointment.time}
                onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, time: value }))}
                disabled={!newAppointment.barberId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddAppointment}
              disabled={
                !newAppointment.clientName ||
                !newAppointment.clientPhone ||
                !newAppointment.barberId ||
                !newAppointment.serviceId ||
                !newAppointment.time
              }
            >
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client";

import React from "react";
import { useState, useCallback, useMemo } from "react";
import { format, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { WeekView } from "@/components/calendar/week-view";
import { DayView } from "@/components/calendar/day-view";
import { MiniCalendar } from "@/components/calendar/mini-calendar";
import { AppointmentDialog } from "@/components/calendar/appointment-dialog";

import {
  useAppointments,
  useBarbers,
  useServices,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/lib/hooks/use-api";
import { availableTimeSlots } from "@/lib/mock-data";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { ProtectedRoute } from "@/components/protected-route";

type CalendarView = "week" | "day";

function AgendaContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [view, setView] = useState<CalendarView>("week");
  const [selectedBarber, setSelectedBarber] = useState("all");

  // Buscar dados da API
  const { data: allAppointments = [], isLoading: appointmentsLoading } =
    useAppointments({});
  const { data: barbers = [], isLoading: barbersLoading } = useBarbers();
  const { data: services = [], isLoading: servicesLoading } = useServices();

  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    clientPhone: "",
    barberId: "",
    serviceId: "",
    date: "",
    time: "",
  });

  // Converter appointments da API para o formato esperado
  const appointments: Appointment[] = useMemo(() => {
    return allAppointments.map((apt: any) => ({
      id: apt.id,
      clientId: apt.clientId,
      clientName: apt.clientName,
      clientPhone: apt.clientPhone,
      barberId: apt.barberId,
      barberName: apt.barber?.name,
      serviceId: apt.serviceId,
      serviceName: apt.service?.name,
      servicePrice: apt.service?.price || 0,
      date: apt.date,
      time: apt.time,
      status: apt.status as AppointmentStatus,
    }));
  }, [allAppointments]);

  // Filter appointments by bar1ber
  const filteredAppointments = useMemo(
    () =>
      selectedBarber === "all"
        ? appointments
        : appointments.filter((a) => a.barberId === selectedBarber),
    [appointments, selectedBarber],
  );

  // Stats
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = appointments.filter(
    (a) => a.date === todayStr && a.status !== "CANCELLED",
  );
  const pendingCount = todayAppointments.filter(
    (a) => a.status === "PENDING",
  ).length;
  const confirmedCount = todayAppointments.filter(
    (a) => a.status === "CONFIRMED",
  ).length;

  // Navigation
  const goToToday = () => {
    setCurrentDate(new Date());
    setDisplayMonth(new Date());
  };

  const goNext = () => {
    if (view === "week") {
      setCurrentDate((d) => addWeeks(d, 1));
    } else {
      setCurrentDate((d) => addDays(d, 1));
    }
  };

  const goPrev = () => {
    if (view === "week") {
      setCurrentDate((d) => subWeeks(d, 1));
    } else {
      setCurrentDate((d) => subDays(d, 1));
    }
  };

  // Open new appointment dialog
  const openNewDialog = (date?: string, time?: string) => {
    setSelectedEvent(null);
    setNewAppointment({
      clientName: "",
      clientPhone: "",
      barberId: "",
      serviceId: "",
      date: date || format(currentDate, "yyyy-MM-dd"),
      time: time || "",
    });
    setDialogOpen(true);
  };

  // Handlers
  const handleSelectSlot = useCallback(
    (date: string, time: string) => {
      openNewDialog(date, time);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDate],
  );

  const handleSelectEvent = useCallback((appointment: Appointment) => {
    setSelectedEvent(appointment);
    setDialogOpen(true);
  }, []);

  const [draggedAppointment, setDraggedAppointment] =
    useState<Appointment | null>(null);

  const handleDragStart = useCallback(
    (_e: React.DragEvent, appointment: Appointment) => {
      setDraggedAppointment(appointment);
    },
    [],
  );

  const handleDropOnSlot = useCallback(
    (date: string, time: string) => {
      if (!draggedAppointment) return;

      updateAppointment.mutate(
        {
          id: draggedAppointment.id,
          data: { date, time },
        },
        {
          onSuccess: () => {
            toast.success(
              `Agendamento movido para ${date.split("-").reverse().join("/")} as ${time}`,
            );
            setDraggedAppointment(null);
          },
          onError: (error) => {
            toast.error(`Erro ao mover: ${error.message}`);
          },
        },
      );
    },
    [draggedAppointment, updateAppointment],
  );

  const handleAdd = () => {
    const barber = barbers.find((b: any) => b.id === newAppointment.barberId);
    const service = services.find(
      (s: any) => s.id === newAppointment.serviceId,
    );
    if (!barber || !service) return;

    createAppointment.mutate(
      {
        clientName: newAppointment.clientName,
        clientPhone: newAppointment.clientPhone,
        barberId: newAppointment.barberId,
        serviceId: newAppointment.serviceId,
        date: newAppointment.date,
        time: newAppointment.time,
        status: "confirmed",
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          toast.success("Agendamento criado com sucesso!");
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`);
        },
      },
    );
  };

  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    updateAppointment.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          const labels: Record<AppointmentStatus, string> = {
            PENDING: "pendente",
            CONFIRMED: "confirmado",
            COMPLETED: "concluido",
            CANCELLED: "cancelado",
          };
          toast.success(`Agendamento ${labels[status]}!`);
          setDialogOpen(false);
          setSelectedEvent(null);
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`);
        },
      },
    );
  };

  const handleUpdate = (id: string, data: any) => {
    updateAppointment.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Agendamento atualizado com sucesso!");
          setDialogOpen(false);
          setSelectedEvent(null);
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteAppointment.mutate(id, {
      onSuccess: () => {
        toast.success("Agendamento excluido");
        setDialogOpen(false);
        setSelectedEvent(null);
      },
      onError: (error) => {
        toast.error(`Erro: ${error.message}`);
      },
    });
  };

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
  };

  // Title based on view
  const title =
    view === "week"
      ? format(currentDate, "'Semana de' d 'de' MMMM", { locale: ptBR })
      : format(currentDate, "d 'de' MMMM, EEEE", { locale: ptBR });

  if (appointmentsLoading || barbersLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-72 shrink-0 border-r border-border bg-card flex flex-col hidden lg:flex">
        <div className="px-4 py-4">
          <MiniCalendar
            selectedDate={currentDate}
            onSelectDate={handleSelectDate}
            displayMonth={displayMonth}
            onChangeMonth={setDisplayMonth}
            appointments={appointments}
          />
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Hoje
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Agendamentos</span>
              <span className="font-semibold text-foreground">
                {todayAppointments.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pendentes</span>
              <span className="font-semibold text-amber-600">
                {pendingCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confirmados</span>
              <span className="font-semibold text-emerald-600">
                {confirmedCount}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">
            Barbeiro
          </label>
          <Select value={selectedBarber} onValueChange={setSelectedBarber}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Filtrar por barbeiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os barbeiros</SelectItem>
              {barbers
                .filter((b: any) => b.active)
                .map((barber: any) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legend */}
        <div className="px-4 pb-4 mt-auto">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Legenda
          </h3>
          <div className="space-y-1.5">
            {[
              { color: "bg-amber-400", label: "Pendente" },
              { color: "bg-emerald-500", label: "Confirmado" },
              { color: "bg-sky-500", label: "Concluido" },
              { color: "bg-red-400", label: "Cancelado" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs bg-transparent"
            >
              Hoje
            </Button>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={goPrev}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={goNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-sm font-semibold text-foreground capitalize hidden sm:block">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-muted rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setView("week")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  view === "week"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Semana
              </button>
              <button
                type="button"
                onClick={() => setView("day")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  view === "day"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                Dia
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => openNewDialog()}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Novo Agendamento
            </Button>
          </div>
        </header>

        {/* Calendar */}
        <div className="flex-1 overflow-hidden bg-card">
          {view === "week" ? (
            <WeekView
              currentDate={currentDate}
              appointments={filteredAppointments}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              onDragStart={handleDragStart}
              onDropOnSlot={handleDropOnSlot}
            />
          ) : (
            <DayView
              currentDate={currentDate}
              appointments={filteredAppointments}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              onDragStart={handleDragStart}
              onDropOnSlot={handleDropOnSlot}
            />
          )}
        </div>
      </main>

      {/* Dialog */}
      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedEvent={selectedEvent}
        newAppointment={newAppointment}
        onNewAppointmentChange={setNewAppointment}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
        barbers={barbers}
        services={services}
        timeSlots={availableTimeSlots}
      />
    </div>
  );
}

export default function AgendaPage() {
  return (
    <ProtectedRoute requiredPermission="MANAGE_APPOINTMENTS">
      <AgendaContent />
    </ProtectedRoute>
  );
}

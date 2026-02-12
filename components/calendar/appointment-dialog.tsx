"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Trash2,
  Clock,
  Phone,
  User,
  Scissors,
  Calendar,
  Edit,
} from "lucide-react";
import type {
  Appointment,
  AppointmentStatus,
  Barber,
  Service,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AppointmentStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  pending: {
    bg: "bg-primary",
    text: "text-secondary",
    border: "border-amber-200",
    label: "Pendente",
  },
  confirmed: {
    bg: "bg-emerald-500",
    text: "text-secondary",
    border: "border-emerald-200",
    label: "Confirmado",
  },
  completed: {
    bg: "bg-sky-500",
    text: "text-secondary",
    border: "border-sky-200",
    label: "Concluido",
  },
  cancelled: {
    bg: "bg-red-500",
    text: "text-foreground",
    border: "border-red-200",
    label: "Cancelado",
  },
};

interface NewAppointmentData {
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status?: AppointmentStatus;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: Appointment | null;
  newAppointment: NewAppointmentData;
  onNewAppointmentChange: (data: NewAppointmentData) => void;
  onAdd: () => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, data: Partial<NewAppointmentData>) => void;
  barbers: Barber[];
  services: Service[];
  timeSlots: string[];
}

export function AppointmentDialog({
  open,
  onOpenChange,
  selectedEvent,
  newAppointment,
  onNewAppointmentChange,
  onAdd,
  onUpdateStatus,
  onDelete,
  onUpdate,
  barbers,
  services,
  timeSlots,
}: AppointmentDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<NewAppointmentData>({
    clientName: "",
    clientPhone: "",
    barberId: "",
    serviceId: "",
    date: "",
    time: "",
    status: "PENDING",
  });

  const isValid =
    newAppointment.clientName &&
    newAppointment.clientPhone &&
    newAppointment.barberId &&
    newAppointment.serviceId &&
    newAppointment.date &&
    newAppointment.time;

  const handleEdit = () => {
    if (selectedEvent) {
      setEditData({
        clientName: selectedEvent.clientName,
        clientPhone: selectedEvent.clientPhone,
        barberId: selectedEvent.barberId,
        serviceId: selectedEvent.serviceId,
        date: selectedEvent.date,
        time: selectedEvent.time,
        status: selectedEvent.status,
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedEvent && onUpdate) {
      onUpdate(selectedEvent.id, editData);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      clientName: "",
      clientPhone: "",
      barberId: "",
      serviceId: "",
      date: "",
      time: "",
      status: "pending",
    });
  };

  if (selectedEvent) {
    const config =
      statusConfig[selectedEvent.status.toLowerCase() as AppointmentStatus];
    const dateFormatted = selectedEvent.date.split("-").reverse().join("/");

    if (isEditing) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg">Editar Agendamento</DialogTitle>
              <DialogDescription>
                Atualize os dados do agendamento
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Nome do Cliente
                </Label>
                <Input
                  value={editData.clientName}
                  onChange={(e) =>
                    setEditData({ ...editData, clientName: e.target.value })
                  }
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Telefone
                </Label>
                <Input
                  value={editData.clientPhone}
                  onChange={(e) =>
                    setEditData({ ...editData, clientPhone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Barbeiro
                </Label>
                <Select
                  value={editData.barberId}
                  onValueChange={(value) =>
                    setEditData({ ...editData, barberId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers
                      .filter((b) => b.active)
                      .map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Serviço
                </Label>
                <Select
                  value={editData.serviceId}
                  onValueChange={(value) =>
                    setEditData({ ...editData, serviceId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services
                      .filter((s) => s.active)
                      .map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={editData.status}
                  onValueChange={(value) =>
                    setEditData({ ...editData, status: value as AppointmentStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Data
                  </Label>
                  <Input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Horário
                  </Label>
                  <Select
                    value={editData.time}
                    onValueChange={(value) =>
                      setEditData({ ...editData, time: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="bg-transparent"
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Detalhes do Agendamento
            </DialogTitle>
            <DialogDescription>Gerencie este agendamento</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status badge */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                config.bg,
                config.text,
                config.border,
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  config.text.replace("text-", "bg-"),
                )}
              />
              {config.label}
            </div>

            {/* Client info */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedEvent.clientName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedEvent.clientPhone}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 pt-3 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{selectedEvent.service?.name || "Servico"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{selectedEvent.barber?.name || "Barbeiro"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dateFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedEvent.time}</span>
                </div>
              </div>

              {selectedEvent.service && (
                <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Valor</span>
                  <span className="text-sm font-bold text-foreground">
                    R$ {selectedEvent.service.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1.5" />
                Editar Agendamento
              </Button>
              {selectedEvent.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    onClick={() =>
                      onUpdateStatus(selectedEvent.id, "CONFIRMED")
                    }
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                    onClick={() =>
                      onUpdateStatus(selectedEvent.id, "CANCELLED")
                    }
                  >
                    <X className="w-4 h-4 mr-1.5" />
                    Cancelar
                  </Button>
                </div>
              )}
              {selectedEvent.status === "CONFIRMED" && (
                <Button
                  variant="outline"
                  className="w-full border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent"
                  onClick={() => onUpdateStatus(selectedEvent.id, "COMPLETED")}
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Concluir Atendimento
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(selectedEvent.id)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Excluir Agendamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Novo Agendamento</DialogTitle>
          <DialogDescription>Preencha os dados para agendar</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Nome do Cliente
            </Label>
            <Input
              value={newAppointment.clientName}
              onChange={(e) =>
                onNewAppointmentChange({
                  ...newAppointment,
                  clientName: e.target.value,
                })
              }
              placeholder="Nome completo"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Telefone
            </Label>
            <Input
              value={newAppointment.clientPhone}
              onChange={(e) =>
                onNewAppointmentChange({
                  ...newAppointment,
                  clientPhone: e.target.value,
                })
              }
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Barbeiro
            </Label>
            <Select
              value={newAppointment.barberId}
              onValueChange={(value) =>
                onNewAppointmentChange({ ...newAppointment, barberId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbers
                  .filter((b) => b.active)
                  .map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Servico
            </Label>
            <Select
              value={newAppointment.serviceId}
              onValueChange={(value) =>
                onNewAppointmentChange({ ...newAppointment, serviceId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o servico" />
              </SelectTrigger>
              <SelectContent>
                {services
                  .filter((s) => s.active)
                  .map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - R$ {service.price}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Data
              </Label>
              <Input
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  onNewAppointmentChange({
                    ...newAppointment,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Horario
              </Label>
              <Select
                value={newAppointment.time}
                onValueChange={(value) =>
                  onNewAppointmentChange({ ...newAppointment, time: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Horario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent"
          >
            Cancelar
          </Button>
          <Button onClick={onAdd} disabled={!isValid}>
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

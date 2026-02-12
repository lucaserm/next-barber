"use client";

import React from "react";

import type { Appointment, AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GripVertical, User, Scissors } from "lucide-react";

const statusConfig: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  PENDING: {
    bg: "bg-secondary",
    border: "border-primary",
    text: "text-primary",
    dot: "bg-primary",
    label: "Pendente",
  },
  CONFIRMED: {
    bg: "bg-emerald-500",
    border: "border-l-emerald-500",
    text: "text-foreground",
    dot: "bg-foreground",
    label: "Confirmado",
  },
  COMPLETED: {
    bg: "bg-sky-500",
    border: "border-l-sky-500",
    text: "text-foreground",
    dot: "bg-foreground",
    label: "Concluido",
  },
  CANCELLED: {
    bg: "bg-red-500",
    border: "border-l-red-400",
    text: "text-red-600",
    dot: "bg-red-400",
    label: "Cancelado",
  },
};

interface EventCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
  onDragStart: (e: React.DragEvent, appointment: Appointment) => void;
  compact?: boolean;
  heightPx?: number;
}

export function EventCard({
  appointment,
  onClick,
  onDragStart,
  compact = false,
  heightPx,
}: EventCardProps) {
  const config = statusConfig[appointment.status as AppointmentStatus];
  const isCancelled = appointment.status === "CANCELLED";

  return (
    <button
      type="button"
      draggable={!isCancelled}
      onDragStart={(e) => onDragStart(e, appointment)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(appointment);
      }}
      className={cn(
        "group w-full text-left rounded-md border-l-[3px] px-2 py-1.5 transition-all",
        "hover:shadow-md hover:scale-[1.01] cursor-grab active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        config.bg,
        config.border,
        isCancelled && "opacity-50 cursor-not-allowed line-through",
      )}
      style={
        heightPx
          ? { height: `${heightPx - 4}px`, overflow: "hidden" }
          : undefined
      }
    >
      <div className="flex items-start gap-1.5">
        {!compact && !isCancelled && (
          <GripVertical className="w-3 h-3 mt-0.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)}
            />
            <span className={cn("text-xs font-semibold truncate", config.text)}>
              {appointment.clientName}
            </span>
          </div>
          {!compact && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Scissors className="w-2.5 h-2.5" />
                {appointment.serviceName || "Servico"}
              </span>
            </div>
          )}
          {!compact && appointment.barberId && (
            <div className="flex items-center gap-0.5 mt-0.5 text-[10px] text-muted-foreground">
              <User className="w-2.5 h-2.5" />
              {appointment.barberName}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

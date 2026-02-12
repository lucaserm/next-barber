"use client";

import React from "react";

import { useMemo, useRef, useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Appointment } from "@/lib/types";
import { EventCard } from "./event-card";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);
const SLOT_HEIGHT = 72;
const HALF_SLOT = SLOT_HEIGHT / 2;

interface DayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectEvent: (appointment: Appointment) => void;
  onSelectSlot: (date: string, time: string) => void;
  onDragStart: (e: React.DragEvent, appointment: Appointment) => void;
  onDropOnSlot: (date: string, time: string) => void;
}

export function DayView({
  currentDate,
  appointments,
  onSelectEvent,
  onSelectSlot,
  onDragStart,
  onDropOnSlot,
}: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  const dateStr = format(currentDate, "yyyy-MM-dd");
  const today = isToday(currentDate);

  const dayAppointments = useMemo(
    () => appointments.filter((a) => a.date === dateStr),
    [appointments, dateStr],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = SLOT_HEIGHT * 1;
    }
  }, []);

  function getEventPosition(appointment: Appointment) {
    const [h, m] = appointment.time.split(":").map(Number);
    const topOffset = (h - 7) * SLOT_HEIGHT + (m / 60) * SLOT_HEIGHT;
    const duration = appointment.service?.duration || 30;
    const height = (duration / 60) * SLOT_HEIGHT;
    return { top: topOffset, height: Math.max(height, HALF_SLOT) };
  }

  const now = new Date();
  const nowOffset =
    (now.getHours() - 7) * SLOT_HEIGHT + (now.getMinutes() / 60) * SLOT_HEIGHT;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex border-b border-border sticky top-0 z-10 bg-card">
        <div className="w-16 shrink-0" />
        <div className={cn("flex-1 text-center py-3", today && "bg-primary/5")}>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {format(currentDate, "EEEE", { locale: ptBR })}
          </div>
          <div
            className={cn(
              "text-2xl font-bold mt-0.5 leading-none",
              today
                ? "w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                : "text-foreground",
            )}
          >
            {format(currentDate, "d")}
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className="flex relative"
          style={{ minHeight: HOURS.length * SLOT_HEIGHT }}
        >
          {/* Time labels */}
          <div className="w-16 shrink-0 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute right-3 text-[11px] text-muted-foreground font-medium -translate-y-1/2"
                style={{ top: (hour - 7) * SLOT_HEIGHT }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day column */}
          <div
            className={cn(
              "flex-1 relative border-l border-border",
              today && "bg-primary/[0.02]",
            )}
          >
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-border/60"
                style={{ top: (hour - 7) * SLOT_HEIGHT }}
              />
            ))}

            {HOURS.map((hour) => (
              <div
                key={`${hour}-30`}
                className="absolute left-0 right-0 border-t border-border/30 border-dashed"
                style={{ top: (hour - 7) * SLOT_HEIGHT + HALF_SLOT }}
              />
            ))}

            {HOURS.flatMap((hour) =>
              [0, 30].map((minute) => {
                const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                const cellKey = `${dateStr}-${timeStr}`;
                const isDragOver = dragOverCell === cellKey;

                return (
                  <div
                    key={cellKey}
                    className={cn(
                      "absolute left-0 right-0 transition-colors hover:bg-primary/[0.04]",
                      isDragOver && "bg-primary/10",
                    )}
                    style={{
                      top:
                        (hour - 7) * SLOT_HEIGHT +
                        (minute === 30 ? HALF_SLOT : 0),
                      height: HALF_SLOT,
                    }}
                    onClick={() => onSelectSlot(dateStr, timeStr)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverCell(cellKey);
                    }}
                    onDragLeave={() => setDragOverCell(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverCell(null);
                      onDropOnSlot(dateStr, timeStr);
                    }}
                  />
                );
              }),
            )}

            {/* Events */}
            {dayAppointments.map((apt) => {
              const { top, height } = getEventPosition(apt);
              const compact = height <= HALF_SLOT;
              return (
                <div
                  key={apt.id}
                  className="absolute left-2 right-2 z-[5]"
                  style={{ top, height }}
                >
                  <EventCard
                    appointment={apt}
                    onClick={onSelectEvent}
                    onDragStart={onDragStart}
                    compact={compact}
                    heightPx={height}
                  />
                </div>
              );
            })}

            {/* Current time line */}
            {today &&
              nowOffset > 0 &&
              nowOffset < HOURS.length * SLOT_HEIGHT && (
                <div
                  className="absolute left-0 right-0 z-[6] pointer-events-none"
                  style={{ top: nowOffset }}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5 shrink-0" />
                    <div className="flex-1 h-[2px] bg-red-500" />
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

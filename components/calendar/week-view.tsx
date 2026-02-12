"use client";

import React from "react";

import { useMemo, useRef, useEffect, useState } from "react";
import { format, addDays, startOfWeek, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Appointment } from "@/lib/types";
import { EventCard } from "./event-card";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00
const SLOT_HEIGHT = 60; // px per hour
const HALF_SLOT = SLOT_HEIGHT / 2;

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectEvent: (appointment: Appointment) => void;
  onSelectSlot: (date: string, time: string) => void;
  onDragStart: (e: React.DragEvent, appointment: Appointment) => void;
  onDropOnSlot: (date: string, time: string) => void;
}

export function WeekView({
  currentDate,
  appointments,
  onSelectEvent,
  onSelectSlot,
  onDragStart,
  onDropOnSlot,
}: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate],
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  // Scroll to 8am on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = SLOT_HEIGHT * 1; // scroll to 8am (1 hour after 7)
    }
  }, []);

  // Group appointments by day
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const day of weekDays) {
      const key = format(day, "yyyy-MM-dd");
      map[key] = appointments.filter((a) => a.date === key);
    }
    return map;
  }, [appointments, weekDays]);

  function getEventPosition(appointment: Appointment) {
    const [h, m] = appointment.time.split(":").map(Number);
    const topOffset = (h - 7) * SLOT_HEIGHT + (m / 60) * SLOT_HEIGHT;
    const duration = appointment.service?.duration || 30;
    const height = (duration / 60) * SLOT_HEIGHT;
    return { top: topOffset, height: Math.max(height, HALF_SLOT) };
  }

  // Current time indicator
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const nowOffset =
    (currentHour - 7) * SLOT_HEIGHT + (currentMinute / 60) * SLOT_HEIGHT;

  return (
    <div className="flex flex-col h-full">
      {/* Header with day names */}
      <div className="flex border-b border-border sticky top-0 z-10 bg-card">
        <div className="w-16 shrink-0" />
        {weekDays.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 text-center py-3 border-l border-border",
                today && "bg-primary/5",
              )}
            >
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                {format(day, "EEE", { locale: ptBR })}
              </div>
              <div
                className={cn(
                  "text-lg font-semibold mt-0.5 leading-none",
                  today
                    ? "w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className="flex relative"
          style={{ minHeight: HOURS.length * SLOT_HEIGHT }}
        >
          {/* Time labels */}
          <div className="w-16 shrink-0 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute right-2 text-[11px] text-muted-foreground font-medium -translate-y-1/2"
                style={{ top: (hour - 7) * SLOT_HEIGHT }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayAppointments = appointmentsByDay[dateStr] || [];
            const today = isToday(day);

            return (
              <div
                key={dateStr}
                className={cn(
                  "flex-1 relative border-l border-border",
                  today && "bg-primary/[0.02]",
                )}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-border/60"
                    style={{ top: (hour - 7) * SLOT_HEIGHT }}
                  />
                ))}

                {/* Half-hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={`${hour}-30`}
                    className="absolute left-0 right-0 border-t border-border/30 border-dashed"
                    style={{ top: (hour - 7) * SLOT_HEIGHT + HALF_SLOT }}
                  />
                ))}

                {/* Clickable slots for each half hour */}
                {HOURS.flatMap((hour) =>
                  [0, 30].map((minute) => {
                    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                    const cellKey = `${dateStr}-${timeStr}`;
                    const isDragOver = dragOverCell === cellKey;

                    return (
                      <div
                        key={cellKey}
                        className={cn(
                          "absolute left-0 right-0 transition-colors",
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
                      className="absolute left-1 right-1 z-[5]"
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

                {/* Current time indicator */}
                {today &&
                  nowOffset > 0 &&
                  nowOffset < HOURS.length * SLOT_HEIGHT && (
                    <div
                      className="absolute left-0 right-0 z-[6] pointer-events-none"
                      style={{ top: nowOffset }}
                    >
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 shrink-0" />
                        <div className="flex-1 h-[2px] bg-red-500" />
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

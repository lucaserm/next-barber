"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  displayMonth: Date;
  onChangeMonth: (date: Date) => void;
  appointments: Appointment[];
}

export function MiniCalendar({
  selectedDate,
  onSelectDate,
  displayMonth,
  onChangeMonth,
  appointments,
}: MiniCalendarProps) {
  const weeks = useMemo(() => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows: Date[][] = [];
    let day = calStart;
    while (day <= calEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      rows.push(week);
    }
    return rows;
  }, [displayMonth]);

  // Count appointments per day
  const appointmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const apt of appointments) {
      if (apt.status !== "cancelled") {
        counts[apt.date] = (counts[apt.date] || 0) + 1;
      }
    }
    return counts;
  }, [appointments]);

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => onChangeMonth(subMonths(displayMonth, 1))}
          className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground capitalize">
          {format(displayMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          type="button"
          onClick={() => onChangeMonth(addMonths(displayMonth, 1))}
          className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {weeks.flat().map((day, idx) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, displayMonth);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const count = appointmentCounts[dateStr] || 0;

          return (
            <button
              type="button"
              key={idx}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex flex-col items-center justify-center py-1.5 text-xs rounded-md transition-all",
                !inMonth && "text-muted-foreground/40",
                inMonth && !selected && "text-foreground hover:bg-accent",
                selected && "bg-primary text-primary-foreground font-semibold",
                today && !selected && "font-semibold text-primary",
              )}
            >
              {format(day, "d")}
              {count > 0 && inMonth && (
                <div className="flex gap-px mt-0.5">
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-1 h-1 rounded-full",
                        selected ? "bg-primary-foreground/70" : "bg-primary/60",
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

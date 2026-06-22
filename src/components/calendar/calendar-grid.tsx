"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DayCell } from "./day-cell";
import { DayModal } from "./day-modal";

interface DayData {
  date: string;
  profitLoss: number;
  tradesCount: number;
  hasNotes: boolean;
  trades: any[];
  notes: any[];
}

interface CalendarGridProps {
  daysData: DayData[];
  initialMonth: number;
  initialYear: number;
}

export function CalendarGrid({ daysData, initialMonth, initialYear }: CalendarGridProps) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Build map of daysData for quick lookup
  const dayMap = useMemo(() => {
    const map = new Map<string, DayData>();
    for (const day of daysData) {
      map.set(day.date, day);
    }
    return map;
  }, [daysData]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay() - 1; // Monday = 0, Sunday = 6
    const adjustedStartPadding = startPadding < 0 ? 6 : startPadding; // Ensure Sunday is last
    const totalDays = adjustedStartPadding + lastDay.getDate();
    const weeks = Math.ceil(totalDays / 7);

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      dayOfMonth: number;
      data?: DayData;
    }> = [];

    for (let i = 0; i < weeks * 7; i++) {
      const date = new Date(year, month, i - adjustedStartPadding + 1);
      const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year;
      const dateKey = date.toISOString().split("T")[0];
      const data = dayMap.get(dateKey);

      days.push({
        date,
        isCurrentMonth,
        dayOfMonth: date.getDate(),
        data,
      });
    }

    return days;
  }, [month, year, dayMap]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  };

  return (
    <div className="space-y-4">
      {/* Month selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handlePrevMonth}>
            ←
          </Button>
          <Button variant="ghost" onClick={handleCurrentMonth}>
            Today
          </Button>
          <Button variant="ghost" onClick={handleNextMonth}>
            →
          </Button>
        </div>
        <h2 className="text-xl font-semibold">
          {new Date(year, month).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
        {/* Days */}
        {calendarDays.map((day, index) => (
          <DayCell
            key={`${day.date.toISOString()}-${index}`}
            day={day.dayOfMonth}
            isCurrentMonth={day.isCurrentMonth}
            profitLoss={day.data?.profitLoss || 0}
            tradesCount={day.data?.tradesCount || 0}
            hasNotes={day.data?.hasNotes || false}
            onClick={() => day.data && setSelectedDay(day.data)}
          />
        ))}
      </div>

      {/* Day modal */}
      <DayModal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        dayData={selectedDay}
      />
    </div>
  );
}

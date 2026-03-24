"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { calendarEventsMock } from "@/mocks/calendar-events.mock";

const days = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];
const calendarNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function CalendarPage() {
  const upcomingCount = calendarEventsMock.length;

  return (
    <AppShell
      title="Calendario"
      subtitle="Calendario"
      chrome="plain"
      centerTopBarTitle
      topBarLeading={<div className="h-12 w-12" />}
      topBarAction={
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-pill bg-[#e9edf5] p-1 shadow-soft">
          <div className="grid grid-cols-2 gap-1">
            <button className="rounded-pill bg-white px-4 py-3 text-[17px] font-semibold text-pawbit-primary shadow-soft">Mes</button>
            <Link href="/calendar/week" className="rounded-pill px-4 py-3 text-center text-[17px] font-medium text-pawbit-muted">
              Semana
            </Link>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-pill border border-pawbit-error-border bg-pawbit-error-bg px-5 py-3 text-[16px] font-medium text-pawbit-primary">Todas ⌄</button>
          <button className="rounded-pill bg-pawbit-chip-default px-5 py-3 text-[16px] font-medium text-pawbit-muted">Vacunas</button>
        </div>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <ChevronLeft className="h-6 w-6 text-pawbit-hint" />
            <h2 className="text-[22px] font-semibold text-pawbit-text">Octubre 2023</h2>
            <ChevronRight className="h-6 w-6 text-pawbit-hint" />
          </div>

          <div className="surface-card p-5">
            <div className="grid grid-cols-7 gap-y-5 text-center">
              {days.map((day) => (
                <p key={day} className="text-[14px] font-semibold text-[#9aa8c0]">{day}</p>
              ))}
              {calendarNumbers.map((day) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-semibold ${day === 5 ? "bg-pawbit-primary text-white shadow-coral" : "text-pawbit-text"}`}>
                    {day}
                  </div>
                  {[1, 7, 11].includes(day) ? <span className="h-1.5 w-1.5 rounded-full bg-pawbit-primary" /> : <span className="h-1.5 w-1.5 opacity-0" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <p className="section-kicker">
            {upcomingCount === 0 ? "Sin eventos próximos" : upcomingCount === 1 ? "Próximo evento" : "Eventos próximos"}
          </p>
          {calendarEventsMock.slice(0, 2).map((event, index) => (
            <div key={event.id} className="surface-card flex items-center gap-4 p-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${index === 0 ? "bg-pawbit-error-bg text-pawbit-primary" : "bg-pawbit-blue-bg text-pawbit-blue"}`}>
                {index === 0 ? "✚" : "💉"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title.replace(/^.* de /, "")}</p>
                <p className="text-[15px] text-pawbit-muted">{index === 0 ? "Mañana, 09:00 AM" : "En 5 días, 11:30 AM"}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-pawbit-hint" />
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

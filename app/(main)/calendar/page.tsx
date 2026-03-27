"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { addMonths, format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { AppShell } from "@/components/layout/app-shell";
import { calendarService } from "@/services/calendar.service";
import { CalendarEvent } from "@/types/calendar-event";
import { ErrorCard, LoadingCard } from "@/components/feedback/state-card";
import { resolveDemoState } from "@/lib/demo-state";
import {
  formatMonthLabel,
  formatUpcomingLabel,
  getEventsForMonth,
  getMonthDays,
  getUpcomingEvents
} from "@/lib/calendar";

const days = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  useEffect(() => {
    const state = resolveDemoState(new URLSearchParams(window.location.search).get("state"));

    if (state === "loading") {
      setStatus("loading");
      return;
    }

    if (state === "error") {
      setStatus("error");
      return;
    }

    calendarService.getEvents().then((data) => {
      setEvents(state === "empty" ? [] : data);
      setStatus("success");
    });
  }, []);

  const monthEvents = useMemo(() => getEventsForMonth(events, currentMonth), [events, currentMonth]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(events).slice(0, 4), [events]);
  const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);
  const today = new Date();

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

        {status === "loading" ? <LoadingCard label="Cargando calendario mensual..." /> : null}
        {status === "error" ? <ErrorCard title="No pudimos cargar el calendario" description="Intenta nuevamente para recuperar los eventos del mes." onRetry={() => window.location.reload()} /> : null}

        {status === "success" ? (
          <>
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setCurrentMonth((current) => addMonths(current, -1))}>
                  <ChevronLeft className="h-6 w-6 text-pawbit-hint" />
                </button>
                <h2 className="text-[22px] font-semibold capitalize text-pawbit-text">{formatMonthLabel(currentMonth)}</h2>
                <button type="button" onClick={() => setCurrentMonth((current) => addMonths(current, 1))}>
                  <ChevronRight className="h-6 w-6 text-pawbit-hint" />
                </button>
              </div>

              <div className="surface-card p-5">
                <div className="grid grid-cols-7 gap-y-5 text-center">
                  {days.map((day) => (
                    <p key={day} className="text-[14px] font-semibold text-[#9aa8c0]">
                      {day}
                    </p>
                  ))}
                  {monthDays.map(({ date, inCurrentMonth }) => {
                    const hasEvent = monthEvents.some((event) => isSameDay(parseISO(event.startDate), date));
                    const isToday = isSameDay(today, date);

                    return (
                      <div key={date.toISOString()} className="flex flex-col items-center gap-2">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-semibold ${
                            isToday
                              ? "bg-pawbit-primary text-white shadow-coral"
                              : inCurrentMonth
                                ? "text-pawbit-text"
                                : "text-pawbit-disabled"
                          }`}
                        >
                          {format(date, "d", { locale: es })}
                        </div>
                        {hasEvent ? <span className="h-1.5 w-1.5 rounded-full bg-pawbit-primary" /> : <span className="h-1.5 w-1.5 opacity-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <p className="section-kicker">
                {upcomingEvents.length === 0 ? "Sin eventos próximos" : upcomingEvents.length === 1 ? "Próximo evento" : "Eventos próximos"}
              </p>
              {upcomingEvents.length ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="surface-card flex items-center gap-4 p-5">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        event.type === "Vacuna" ? "bg-pawbit-blue-bg text-pawbit-blue" : "bg-pawbit-error-bg text-pawbit-primary"
                      }`}
                    >
                      {event.type === "Vacuna" ? "💉" : "✚"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title}</p>
                      <p className="text-[15px] text-pawbit-muted">{format(parseISO(event.startDate), "EEEE d MMM, HH:mm", { locale: es })}</p>
                    </div>
                    <span className="rounded-pill bg-pawbit-error-bg px-3 py-2 text-sm font-semibold text-pawbit-primary">
                      {formatUpcomingLabel(event.startDate, today)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-[22px] bg-white px-5 py-4 text-sm text-pawbit-muted shadow-soft">No hay eventos futuros para mostrar.</p>
              )}
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

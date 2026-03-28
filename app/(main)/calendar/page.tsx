"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { addMonths, format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { AppShell } from "@/components/layout/app-shell";
import { calendarService } from "@/services/calendar.service";
import { CalendarEvent } from "@/types/calendar-event";
import { ErrorCard, LoadingCard } from "@/components/feedback/state-card";
import { EmptyState } from "@/components/ui/empty-state";
import { resolveDemoState } from "@/lib/demo-state";
import {
  getEventsForDay,
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const eventsPanelRef = useRef<HTMLElement | null>(null);

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
  const selectedDayEvents = useMemo(() => (selectedDate ? getEventsForDay(events, selectedDate) : []), [events, selectedDate]);
  const today = new Date();

  useEffect(() => {
    setSelectedDate(null);
  }, [currentMonth]);

  useEffect(() => {
    if (!selectedDate) return;

    requestAnimationFrame(() => {
      eventsPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, [selectedDate]);

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
                    const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                        }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-semibold ${
                            isSelected
                              ? "bg-pawbit-primary text-white shadow-coral"
                              : isToday
                              ? "bg-pawbit-primary text-white shadow-coral"
                              : inCurrentMonth
                                ? "text-pawbit-text"
                                : "text-pawbit-disabled"
                          } ${isToday && !isSelected ? "ring-2 ring-pawbit-primary/15" : ""}`}
                        >
                          {format(date, "d", { locale: es })}
                        </div>
                        {hasEvent ? <span className="h-1.5 w-1.5 rounded-full bg-pawbit-primary" /> : <span className="h-1.5 w-1.5 opacity-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section ref={eventsPanelRef} className="overflow-hidden rounded-t-[28px] border border-pawbit-stroke bg-white shadow-soft">
              <div className="flex w-full items-center justify-between px-5 pb-3 pt-4 text-left">
                <div>
                  <p className="section-kicker">
                    {selectedDate
                      ? `Eventos del ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
                      : upcomingEvents.length === 0
                        ? "Sin eventos próximos"
                        : upcomingEvents.length === 1
                          ? "Próximo evento"
                          : "Próximos eventos"}
                  </p>
                  {selectedDate ? (
                    <p className="mt-1 text-sm text-pawbit-muted">{selectedDayEvents.length ? `${selectedDayEvents.length} evento${selectedDayEvents.length === 1 ? "" : "s"}` : "Sin eventos para esta fecha"}</p>
                  ) : null}
                </div>
              </div>

              <div className="mx-auto mb-1 h-1.5 w-14 rounded-full bg-pawbit-stroke" />

              <div className={`px-5 pb-5 ${selectedDate ? "max-h-[360px] overflow-y-auto" : ""}`}>
                {selectedDate ? (
                  selectedDayEvents.length ? (
                    <div className="space-y-3 pt-3">
                      {selectedDayEvents.map((event) => (
                        <CalendarEventRow key={event.id} event={event} today={today} />
                      ))}
                    </div>
                  ) : (
                    <div className="pt-3">
                      <EmptyState
                        title="Sin eventos para este día"
                        description="Todavía no hay vacunas, controles o recordatorios en la fecha seleccionada."
                        actionLabel="Registrar evento"
                        onAction={() => {
                          window.location.href = "/register";
                        }}
                      />
                    </div>
                  )
                ) : upcomingEvents.length ? (
                  <div className="space-y-3 pt-3">
                    {upcomingEvents.map((event) => (
                      <CalendarEventRow key={event.id} event={event} today={today} />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-[22px] bg-pawbit-background px-5 py-4 text-sm text-pawbit-muted">No hay eventos futuros para mostrar.</p>
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function CalendarEventRow({ event, today }: { event: CalendarEvent; today: Date }) {
  return (
    <div className="surface-card flex items-center gap-4 p-5">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          event.type === "Vacuna"
            ? "bg-pawbit-blue-bg text-pawbit-blue"
            : event.type === "Control"
              ? "bg-[#fff1df] text-[#de8b14]"
              : "bg-pawbit-error-bg text-pawbit-primary"
        }`}
      >
        {event.type === "Vacuna" ? "💉" : event.type === "Control" ? "✚" : "⏰"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title}</p>
        <p className="text-[15px] text-pawbit-muted">{format(parseISO(event.startDate), "EEEE d MMM, HH:mm", { locale: es })}</p>
      </div>
      <span className="rounded-pill bg-pawbit-error-bg px-3 py-2 text-sm font-semibold text-pawbit-primary">
        {formatUpcomingLabel(event.startDate, today)}
      </span>
    </div>
  );
}

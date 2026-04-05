"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { CalendarEvent } from "@/types/calendar-event";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatUpcomingLabel,
  formatWeekLabel,
  getEventsForDay,
  getWeekDays
} from "@/lib/calendar";
import { useEventDetailsStore } from "@/store/event-details-store";

const weekdayLabels = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export function WeekCalendar({
  currentWeek,
  visibleEvents,
  upcomingEvents,
  selectedDate,
  onSelectDate,
  onPreviousWeek,
  onNextWeek
}: {
  currentWeek: Date;
  visibleEvents: CalendarEvent[];
  upcomingEvents: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}) {
  const openEventDetails = useEventDetailsStore((state) => state.openEventDetails);
  const weekDays = getWeekDays(currentWeek);
  const today = new Date();
  const eventsPanelRef = useRef<HTMLElement | null>(null);

  const selectedDayEvents = useMemo(
    () => (selectedDate ? getEventsForDay(visibleEvents, selectedDate) : []),
    [selectedDate, visibleEvents]
  );

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
    <section className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <button type="button" onClick={onPreviousWeek} className="text-2xl text-pawbit-primary">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h2 className="text-center text-[18px] font-semibold uppercase tracking-[0.08em] text-pawbit-primary">
          {formatWeekLabel(currentWeek)}
        </h2>
        <button type="button" onClick={onNextWeek} className="text-2xl text-pawbit-primary">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="surface-card p-4">
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((date, index) => {
            const eventsForDay = getEventsForDay(visibleEvents, date);
            const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
            const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => onSelectDate(date)}
                className="space-y-2"
              >
                <p className="text-[13px] font-semibold text-[#97a5be]">{weekdayLabels[index]}</p>
                <div
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[18px] font-semibold ${
                    isSelected
                      ? "bg-pawbit-primary text-white"
                      : isToday
                        ? "bg-pawbit-primary text-white"
                        : "text-pawbit-text"
                  } ${isToday && !isSelected ? "ring-2 ring-pawbit-primary/15" : ""}`}
                >
                  {format(date, "d", { locale: es })}
                </div>
                <span className={`mx-auto block h-1.5 w-1.5 rounded-full ${eventsForDay.length ? "bg-pawbit-primary" : "opacity-0"}`} />
              </button>
            );
          })}
        </div>
      </div>

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
              <p className="mt-1 text-sm text-pawbit-muted">
                {selectedDayEvents.length
                  ? `${selectedDayEvents.length} evento${selectedDayEvents.length === 1 ? "" : "s"}`
                  : "Sin eventos para esta fecha"}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mb-1 h-1.5 w-14 rounded-full bg-pawbit-stroke" />

        <div className={`px-5 pb-5 ${selectedDate ? "max-h-[360px] overflow-y-auto" : ""}`}>
          {selectedDate ? (
            selectedDayEvents.length ? (
              <div className="space-y-3 pt-3">
                {selectedDayEvents.map((event) => (
                  <CalendarEventRow key={event.id} event={event} today={today} onSelect={openEventDetails} />
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
                <CalendarEventRow key={event.id} event={event} today={today} onSelect={openEventDetails} />
              ))}
            </div>
          ) : (
            <p className="rounded-[22px] bg-white px-5 py-4 text-sm text-pawbit-muted shadow-soft">
              No hay eventos futuros para mostrar.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

function CalendarEventRow({ event, today, onSelect }: { event: CalendarEvent; today: Date; onSelect: (event: CalendarEvent) => void }) {
  return (
    <button type="button" onClick={() => onSelect(event)} className="surface-card flex w-full items-center gap-4 p-5 text-left">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          event.type === "Control"
            ? "bg-[#fff1df] text-[#de8b14]"
            : event.type === "Vacuna"
              ? "bg-pawbit-error-bg text-pawbit-primary"
              : "bg-pawbit-blue-bg text-pawbit-blue"
        }`}
      >
        {event.type === "Control" ? "✚" : event.type === "Vacuna" ? "💉" : "⏰"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title}</p>
        <p className="text-[15px] text-pawbit-muted">
          {format(parseISO(event.startDate), "EEEE d MMM, HH:mm", { locale: es })}
        </p>
      </div>
      <span className="rounded-pill bg-pawbit-error-bg px-3 py-2 text-sm font-semibold text-pawbit-primary">
        {formatUpcomingLabel(event.startDate, today)}
      </span>
    </button>
  );
}

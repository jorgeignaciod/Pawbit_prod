import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { CalendarEvent } from "@/types/calendar-event";
import { formatUpcomingLabel, formatWeekLabel, getEventsForDay, getWeekDays } from "@/lib/calendar";

const weekdayLabels = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export function WeekCalendar({
  currentWeek,
  visibleEvents,
  upcomingEvents,
  onPreviousWeek,
  onNextWeek
}: {
  currentWeek: Date;
  visibleEvents: CalendarEvent[];
  upcomingEvents: CalendarEvent[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}) {
  const weekDays = getWeekDays(currentWeek);
  const today = new Date();

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

            return (
              <div key={date.toISOString()} className="space-y-2">
                <p className="text-[13px] font-semibold text-[#97a5be]">{weekdayLabels[index]}</p>
                <div
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[18px] font-semibold ${
                    isToday ? "bg-pawbit-primary text-white" : "text-pawbit-text"
                  }`}
                >
                  {format(date, "d", { locale: es })}
                </div>
                <span className={`mx-auto block h-1.5 w-1.5 rounded-full ${eventsForDay.length ? "bg-pawbit-primary" : "opacity-0"}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <p className="section-kicker">Próximos eventos</p>
        {upcomingEvents.length ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="surface-card flex items-center gap-4 p-5">
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
            </div>
          ))
        ) : (
          <p className="rounded-[22px] bg-white px-5 py-4 text-sm text-pawbit-muted shadow-soft">
            No hay eventos futuros para mostrar.
          </p>
        )}
      </div>
    </section>
  );
}

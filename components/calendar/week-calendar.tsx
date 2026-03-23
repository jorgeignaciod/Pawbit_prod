import { format } from "date-fns";
import { es } from "date-fns/locale";

import { CalendarEvent } from "@/types/calendar-event";

const days = [
  { label: "LUN", day: 2 },
  { label: "MAR", day: 3 },
  { label: "MIÉ", day: 4 },
  { label: "JUE", day: 5 },
  { label: "VIE", day: 6 },
  { label: "SÁB", day: 7 },
  { label: "DOM", day: 8 }
];

export function WeekCalendar({ events }: { events: CalendarEvent[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <span className="text-2xl text-pawbit-primary">‹</span>
        <h2 className="text-center text-[18px] font-semibold uppercase tracking-[0.08em] text-pawbit-primary">
          Semana del 2-8 mar
        </h2>
        <span className="text-2xl text-pawbit-primary">›</span>
      </div>

      <div className="surface-card p-4">
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((item) => (
            <div key={item.label} className="space-y-2">
              <p className="text-[13px] font-semibold text-[#97a5be]">{item.label}</p>
              <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[18px] font-semibold ${item.day === 4 ? "bg-pawbit-primary text-white" : "text-pawbit-text"}`}>
                {item.day}
              </div>
              <span className={`mx-auto block h-1.5 w-1.5 rounded-full ${item.day === 5 ? "bg-pawbit-primary" : "opacity-0"}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="section-kicker">Próximos eventos</p>
        {events.slice(0, 2).map((event, index) => (
          <div key={event.id} className="surface-card flex items-center gap-4 p-5">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${index === 0 ? "bg-[#fff1df] text-[#de8b14]" : "bg-pawbit-error-bg text-pawbit-primary"}`}>
              {index === 0 ? "✚" : "💉"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title.replace(/^.* de /, "")}</p>
              <p className="text-[15px] text-pawbit-muted">
                {index === 0 ? "Recordatorio de dosis mensual" : "Clínica Veterinaria Central"}
              </p>
            </div>
            <span className={`rounded-pill px-3 py-2 text-sm font-semibold ${index === 0 ? "bg-[#fff1df] text-[#de8b14]" : "bg-pawbit-error-bg text-pawbit-primary"}`}>
              {index === 0 ? "Mañana" : "En 5 días"}
            </span>
          </div>
        ))}
      </div>

      <p className="hidden">{format(new Date(events[0]?.startDate ?? new Date()), "d MMM", { locale: es })}</p>
    </section>
  );
}

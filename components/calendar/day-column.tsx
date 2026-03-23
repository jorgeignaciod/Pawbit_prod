import { format } from "date-fns";
import { es } from "date-fns/locale";

import { EventChip } from "@/components/calendar/event-chip";
import { CalendarEvent } from "@/types/calendar-event";

export function DayColumn({
  date,
  events
}: {
  date: Date;
  events: CalendarEvent[];
}) {
  return (
    <div className="surface-card min-w-[220px] p-4">
      <p className="text-xs text-pawbit-muted">{format(date, "EEEE", { locale: es })}</p>
      <h2 className="mt-1 capitalize">{format(date, "d MMM", { locale: es })}</h2>
      <div className="mt-4 space-y-3">
        {events.length ? (
          events.map((event) => <EventChip key={event.id} event={event} />)
        ) : (
          <p className="text-sm text-pawbit-muted">Sin eventos para este día.</p>
        )}
      </div>
    </div>
  );
}

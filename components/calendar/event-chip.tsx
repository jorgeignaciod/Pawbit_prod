import { format } from "date-fns";
import { es } from "date-fns/locale";

import { StatusBadge } from "@/components/ui/status-badge";
import { CalendarEvent } from "@/types/calendar-event";

export function EventChip({ event }: { event: CalendarEvent }) {
  return (
    <div className="rounded-md bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-pawbit-text">{event.title}</p>
        <StatusBadge status={event.status} />
      </div>
      <p className="mt-1 text-xs text-pawbit-muted">
        {format(new Date(event.startDate), "HH:mm", { locale: es })} · {event.type}
      </p>
    </div>
  );
}

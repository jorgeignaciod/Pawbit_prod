"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { StatusBadge } from "@/components/ui/status-badge";
import { useEventDetailsStore } from "@/store/event-details-store";
import { CalendarEvent } from "@/types/calendar-event";

export function EventChip({ event }: { event: CalendarEvent }) {
  const openEventDetails = useEventDetailsStore((state) => state.openEventDetails);

  return (
    <button type="button" onClick={() => openEventDetails(event)} className="w-full rounded-md bg-white p-3 text-left shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-pawbit-text">{event.title}</p>
        <StatusBadge status={event.status} />
      </div>
      <p className="mt-1 text-xs text-pawbit-muted">
        {format(new Date(event.startDate), "HH:mm", { locale: es })} · {event.type}
      </p>
    </button>
  );
}

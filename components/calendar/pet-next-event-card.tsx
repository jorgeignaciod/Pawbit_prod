"use client";

import { CalendarEvent } from "@/types/calendar-event";
import { useEventDetailsStore } from "@/store/event-details-store";

export function PetNextEventCard({ event }: { event: CalendarEvent }) {
  const openEventDetails = useEventDetailsStore((state) => state.openEventDetails);

  return (
    <button
      type="button"
      onClick={() => openEventDetails(event)}
      className="surface-card mt-4 flex w-full items-center gap-4 border-pawbit-error-border/50 bg-pawbit-error-bg/30 p-5 text-left"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pawbit-chip-active text-pawbit-primary">✚</div>
      <div className="min-w-0 flex-1">
        <p className="text-[18px] font-semibold text-pawbit-text">{event.title.replace(/^.* de /, "")}</p>
        <p className="text-[15px] text-pawbit-primary">Mañana, 09:00 AM</p>
      </div>
      <span className="text-2xl text-pawbit-hint">›</span>
    </button>
  );
}

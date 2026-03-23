import { CalendarEventStatus } from "@/types/calendar-event";

const badgeMap: Record<CalendarEventStatus, string> = {
  Pendiente: "bg-pawbit-warning-bg text-pawbit-text",
  Completado: "bg-pawbit-success-bg text-pawbit-text",
  Atención: "bg-pawbit-error-bg text-pawbit-text"
};

export function StatusBadge({ status }: { status: CalendarEventStatus }) {
  return <span className={`rounded-pill px-3 py-1 text-xs font-medium ${badgeMap[status]}`}>{status}</span>;
}

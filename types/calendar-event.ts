export type CalendarEventType = "Vacuna" | "Control" | "Recordatorio" | "Medicamento";
export type CalendarEventStatus = "Pendiente" | "Completado" | "Atención";

export interface CalendarEvent {
  id: string;
  petId: string;
  type: CalendarEventType;
  title: string;
  startDate: string;
  endDate: string;
  reminder: string;
  status: CalendarEventStatus;
}

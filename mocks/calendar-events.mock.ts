import { CalendarEvent } from "@/types/calendar-event";

export const calendarEventsMock: CalendarEvent[] = [
  {
    id: "event-1",
    petId: "pet-1",
    type: "Vacuna",
    title: "Refuerzo séxtuple de Mora",
    startDate: "2026-03-24T10:00:00.000Z",
    endDate: "2026-03-24T10:30:00.000Z",
    reminder: "24 horas antes",
    status: "Pendiente"
  },
  {
    id: "event-2",
    petId: "pet-2",
    type: "Control",
    title: "Control urinario de Simba",
    startDate: "2026-03-26T14:00:00.000Z",
    endDate: "2026-03-26T14:40:00.000Z",
    reminder: "2 horas antes",
    status: "Atención"
  },
  {
    id: "event-3",
    petId: "pet-1",
    type: "Recordatorio",
    title: "Comprar antiparasitario",
    startDate: "2026-03-27T18:00:00.000Z",
    endDate: "2026-03-27T18:15:00.000Z",
    reminder: "El mismo día",
    status: "Pendiente"
  },
  {
    id: "event-4",
    petId: "pet-2",
    type: "Medicamento",
    title: "Última dosis suplemento",
    startDate: "2026-03-22T09:00:00.000Z",
    endDate: "2026-03-22T09:15:00.000Z",
    reminder: "1 hora antes",
    status: "Completado"
  }
];

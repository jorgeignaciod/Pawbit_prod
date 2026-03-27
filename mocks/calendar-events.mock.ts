import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  setHours,
  setMinutes,
  subDays
} from "date-fns";

import { CalendarEvent } from "@/types/calendar-event";

function isoAt(date: Date, hours: number, minutes = 0) {
  return setMinutes(setHours(date, hours), minutes).toISOString();
}

const today = new Date();

export const calendarEventsMock: CalendarEvent[] = [
  {
    id: "event-1",
    petId: "pet-1",
    type: "Vacuna",
    title: "Refuerzo séxtuple de Mora",
    startDate: isoAt(addDays(today, 1), 10),
    endDate: isoAt(addDays(today, 1), 10, 30),
    reminder: "24 horas antes",
    status: "Pendiente"
  },
  {
    id: "event-2",
    petId: "pet-2",
    type: "Control",
    title: "Control urinario de Simba",
    startDate: isoAt(addDays(today, 3), 14),
    endDate: isoAt(addDays(today, 3), 14, 40),
    reminder: "2 horas antes",
    status: "Atención"
  },
  {
    id: "event-3",
    petId: "pet-1",
    type: "Recordatorio",
    title: "Comprar antiparasitario",
    startDate: isoAt(addDays(today, 6), 18),
    endDate: isoAt(addDays(today, 6), 18, 15),
    reminder: "El mismo día",
    status: "Pendiente"
  },
  {
    id: "event-4",
    petId: "pet-2",
    type: "Medicamento",
    title: "Última dosis suplemento",
    startDate: isoAt(subDays(today, 5), 9),
    endDate: isoAt(subDays(today, 5), 9, 15),
    reminder: "1 hora antes",
    status: "Completado"
  },
  {
    id: "event-5",
    petId: "pet-1",
    type: "Control",
    title: "Chequeo dermatológico de Mora",
    startDate: isoAt(addWeeks(today, 1), 11, 30),
    endDate: isoAt(addWeeks(today, 1), 12),
    reminder: "1 día antes",
    status: "Pendiente"
  },
  {
    id: "event-6",
    petId: "pet-2",
    type: "Vacuna",
    title: "Vacuna triple felina de Simba",
    startDate: isoAt(addDays(addWeeks(today, 2), 2), 16),
    endDate: isoAt(addDays(addWeeks(today, 2), 2), 16, 30),
    reminder: "24 horas antes",
    status: "Pendiente"
  },
  {
    id: "event-7",
    petId: "pet-1",
    type: "Medicamento",
    title: "Inicio tratamiento articular",
    startDate: isoAt(addDays(addWeeks(today, 3), 1), 8),
    endDate: isoAt(addDays(addWeeks(today, 3), 1), 8, 20),
    reminder: "3 horas antes",
    status: "Atención"
  },
  {
    id: "event-8",
    petId: "pet-2",
    type: "Recordatorio",
    title: "Renovar arena sanitaria",
    startDate: isoAt(addDays(addWeeks(today, 4), 5), 19),
    endDate: isoAt(addDays(addWeeks(today, 4), 5), 19, 10),
    reminder: "El mismo día",
    status: "Pendiente"
  }
];

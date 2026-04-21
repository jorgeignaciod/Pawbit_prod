import { describe, expect, it } from "vitest";

import { formatUpcomingLabel, getEventsForDay, getMonthDays, getUpcomingEvents, getWeekDays } from "@/lib/calendar";
import { CalendarEvent } from "@/types/calendar-event";

const events: CalendarEvent[] = [
  {
    id: "event_1",
    petId: "pet_1",
    type: "VACUNA",
    title: "Vacuna Rabia",
    startDate: "2026-04-21T10:00:00.000Z",
    endDate: "2026-04-21T10:30:00.000Z",
    reminder: "2026-04-20T10:00:00.000Z",
    status: "PENDIENTE"
  },
  {
    id: "event_2",
    petId: "pet_1",
    type: "CONTROL",
    title: "Control general",
    startDate: "2026-04-25T09:00:00.000Z",
    endDate: "2026-04-25T09:30:00.000Z",
    reminder: "2026-04-24T09:00:00.000Z",
    status: "PENDIENTE"
  }
];

describe("calendar helpers", () => {
  it("retorna la grilla mensual completa", () => {
    const monthDays = getMonthDays(new Date("2026-04-15T12:00:00.000Z"));

    expect(monthDays.length).toBeGreaterThanOrEqual(35);
    expect(monthDays.some((day) => day.inCurrentMonth)).toBe(true);
  });

  it("retorna una semana de 7 días", () => {
    expect(getWeekDays(new Date("2026-04-15T12:00:00.000Z"))).toHaveLength(7);
  });

  it("filtra próximos eventos desde una fecha dada", () => {
    const upcoming = getUpcomingEvents(events, new Date("2026-04-22T00:00:00.000Z"));

    expect(upcoming).toHaveLength(1);
    expect(upcoming[0]?.id).toBe("event_2");
  });

  it("retorna eventos del día seleccionado", () => {
    const selected = getEventsForDay(events, new Date("2026-04-21T12:00:00.000Z"));

    expect(selected).toHaveLength(1);
    expect(selected[0]?.title).toBe("Vacuna Rabia");
  });

  it("genera label humana para el próximo evento", () => {
    expect(formatUpcomingLabel("2026-04-21T10:00:00.000Z", new Date("2026-04-20T10:00:00.000Z"))).toBe("Mañana");
  });
});

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { es } from "date-fns/locale";

import { CalendarEvent } from "@/types/calendar-event";

export function sortEventsByStartDate(events: CalendarEvent[]) {
  return [...events].sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
}

export function getUpcomingEvents(events: CalendarEvent[], from = new Date()) {
  return sortEventsByStartDate(events).filter((event) => parseISO(event.startDate).getTime() >= from.getTime());
}

export function getMonthDays(monthDate: Date) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    inCurrentMonth: isSameMonth(date, monthDate)
  }));
}

export function getWeekDays(weekDate: Date) {
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function getEventsForMonth(events: CalendarEvent[], monthDate: Date) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  return events.filter((event) =>
    isWithinInterval(parseISO(event.startDate), {
      start: monthStart,
      end: monthEnd
    })
  );
}

export function getEventsForWeek(events: CalendarEvent[], weekDate: Date) {
  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });

  return events.filter((event) =>
    isWithinInterval(parseISO(event.startDate), {
      start: weekStart,
      end: weekEnd
    })
  );
}

export function hasEventsForDay(events: CalendarEvent[], date: Date) {
  return events.some((event) => isSameDay(parseISO(event.startDate), date));
}

export function getEventsForDay(events: CalendarEvent[], date: Date) {
  return sortEventsByStartDate(events).filter((event) => isSameDay(parseISO(event.startDate), date));
}

export function formatMonthLabel(date: Date) {
  return format(date, "MMMM yyyy", { locale: es });
}

export function formatWeekLabel(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  return `Semana del ${format(weekStart, "d", { locale: es })}-${format(weekEnd, "d MMM", { locale: es })}`;
}

export function formatUpcomingLabel(startDate: string, today = new Date()) {
  const eventDate = parseISO(startDate);
  const diffInDays = Math.floor((eventDate.setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0)) / 86400000);

  if (diffInDays <= 0) return "Hoy";
  if (diffInDays === 1) return "Mañana";
  return `En ${diffInDays} días`;
}

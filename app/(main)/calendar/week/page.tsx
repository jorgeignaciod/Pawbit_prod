"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { EmptyState } from "@/components/ui/empty-state";
import { WeekCalendar } from "@/components/calendar/week-calendar";
import { petsMock } from "@/mocks/pets.mock";
import { calendarService } from "@/services/calendar.service";
import { DemoState, resolveDemoState } from "@/lib/demo-state";
import { CalendarEvent } from "@/types/calendar-event";

export default function CalendarWeekPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [petFilter, setPetFilter] = useState("all");
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [viewState, setViewState] = useState<DemoState>("default");

  useEffect(() => {
    const nextViewState = resolveDemoState(new URLSearchParams(window.location.search).get("state"));
    setViewState(nextViewState);

    if (nextViewState === "loading") {
      setStatus("loading");
      return;
    }

    if (nextViewState === "error") {
      setStatus("error");
      return;
    }

    calendarService.getEvents().then((data) => {
      setEvents(nextViewState === "empty" ? [] : data);
      setStatus("success");
    });
  }, []);

  const filteredEvents = useMemo(() => {
    if (petFilter === "all") return events;
    return events.filter((event) => event.petId === petFilter);
  }, [events, petFilter]);

  return (
    <AppShell
      title="Calendario"
      subtitle="Calendario Semanal"
      chrome="plain"
      topBarAction={
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-pill bg-[#fdeff0] p-1 shadow-soft">
          <div className="grid grid-cols-2 gap-1">
            <Link href="/calendar" className="rounded-pill px-4 py-3 text-center text-[17px] font-medium text-pawbit-muted">
              Mes
            </Link>
            <button className="rounded-pill bg-white px-4 py-3 text-[17px] font-semibold text-pawbit-primary shadow-soft">Semana</button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          <button className={`rounded-pill border px-5 py-3 text-[16px] font-medium ${petFilter === "all" ? "border-pawbit-error-border bg-pawbit-error-bg text-pawbit-primary" : "border-pawbit-stroke bg-white text-pawbit-muted"}`} onClick={() => setPetFilter("all")}>
            Todas ⌄
          </button>
          {petsMock.map((pet) => (
            <button key={pet.id} className={`rounded-pill border px-5 py-3 text-[16px] font-medium ${petFilter === pet.id ? "border-pawbit-error-border bg-pawbit-error-bg text-pawbit-primary" : "border-pawbit-stroke bg-white text-pawbit-muted"}`} onClick={() => setPetFilter(pet.id)}>
              {pet.name}
            </button>
          ))}
        </div>

        {viewState === "success" ? (
          <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">Recordatorio sincronizado en el calendario semanal.</div>
        ) : null}

        {status === "loading" ? <LoadingCard label="Cargando semana en curso..." /> : null}
        {status === "error" ? <ErrorCard title="No pudimos cargar el calendario" description="Reintenta para recuperar los eventos de la semana." onRetry={() => window.location.reload()} /> : null}
        {status === "success" ? filteredEvents.length ? <WeekCalendar events={filteredEvents} /> : <EmptyState title="Sin eventos en esta semana" description="Cuando agregues vacunas, controles o recordatorios aparecerán aquí." /> : null}
      </div>
    </AppShell>
  );
}

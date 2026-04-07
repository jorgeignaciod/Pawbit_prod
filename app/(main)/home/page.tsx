"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { PetSummaryCard } from "@/components/pets/pet-summary-card";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationButton } from "@/components/ui/notification-button";
import { formatUpcomingLabel } from "@/lib/calendar";
import { calendarService } from "@/services/calendar.service";
import { petsService } from "@/services/pets.service";
import { DemoState, resolveDemoState } from "@/lib/demo-state";
import { useAppStore } from "@/store/app-store";
import { useEventDetailsStore } from "@/store/event-details-store";
import { Pet } from "@/types/pet";
import { CalendarEvent } from "@/types/calendar-event";

export default function HomePage() {
  const user = useAppStore((state) => state.user);
  const openEventDetails = useEventDetailsStore((state) => state.openEventDetails);
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [viewState, setViewState] = useState<DemoState>("default");
  const selectedPet = useMemo(() => pets[0] ?? null, [pets]);
  const petsCount = pets.length;
  const eventsCount = events.length;
  const visibleEvents = useMemo(() => events.slice(0, 2), [events]);
  const firstName = useMemo(() => user?.name?.trim().split(/\s+/)[0] ?? "", [user?.name]);

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

    petsService
      .getPets()
      .then(async (petsData) => {
        const nextPets = nextViewState === "empty" ? [] : petsData;
        const eventsData = nextPets.length ? await calendarService.getEvents() : [];

        setPets(nextPets);
        setEvents(nextViewState === "empty" ? [] : eventsData);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <AppShell
      title="Inicio"
      subtitle="Inicio"
      chrome="plain"
      hideTopBarTitle
      topBarLeading={<h1 className="text-[28px] font-semibold tracking-[-0.03em] text-pawbit-text">{firstName ? `Hola, ${firstName}` : "Hola"}</h1>}
      topBarAction={<NotificationButton />}
    >
      <div className="space-y-6">
        {viewState === "success" ? (
          <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">
            {petsCount > 1
              ? "Los recordatorios de tus mascotas están sincronizados correctamente."
              : "Los recordatorios de tu mascota están sincronizados correctamente."}
          </div>
        ) : null}

        {status === "loading" ? (
          <LoadingCard label={petsCount > 1 ? "Cargando resumen de tus mascotas..." : "Cargando resumen de tu mascota..."} />
        ) : null}
        {status === "error" ? (
          <ErrorCard
            title="No pudimos cargar tu panel"
            description={
              petsCount > 1
                ? "Intenta nuevamente para ver los próximos eventos y recordatorios de tus mascotas."
                : "Intenta nuevamente para ver los próximos eventos y recordatorios de tu mascota."
            }
            onRetry={() => window.location.reload()}
          />
        ) : null}

        {status === "success" ? (
          <>
            <SectionHeader
              title={
                eventsCount === 0
                  ? "Sin próximos eventos"
                  : eventsCount === 1
                    ? "Próximo evento"
                    : "Próximos eventos"
              }
              action={
                <Link href="/calendar/week" className="text-[15px] font-medium text-pawbit-primary">
                  Ver todos
                </Link>
              }
            />

            {visibleEvents.length ? (
              <div className="space-y-3">
                {visibleEvents.map((event) => (
                  <HomeEventRow key={event.id} event={event} onSelect={openEventDetails} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={petsCount === 0 ? "Aún no hay eventos para mostrar" : petsCount > 1 ? "No hay eventos próximos para tus mascotas" : "No hay eventos próximos para tu mascota"}
                description={
                  petsCount === 0
                    ? "Cuando registres tu primera mascota y agregues controles o vacunas, el calendario empezará a llenarse."
                    : petsCount > 1
                    ? "Cuando registres vacunas o controles de tus mascotas aparecerán aquí."
                    : "Cuando registres vacunas o controles de tu mascota aparecerán aquí."
                }
              />
            )}

            <SectionHeader title={pets.length > 1 ? "Resumen de tus mascotas" : "Resumen de tu mascota"} />
            {pets.length ? (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <PetSummaryCard key={pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aún no tienes mascotas registradas"
                description="Agrega tu primera mascota para empezar a registrar salud y recordatorios."
                actionLabel="Ir a mascota"
                onAction={() => (window.location.href = "/pets")}
              />
            )}

            {selectedPet ? null : null}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function HomeEventRow({ event, onSelect }: { event: CalendarEvent; onSelect: (event: CalendarEvent) => void }) {
  const today = new Date();

  return (
    <button type="button" onClick={() => onSelect(event)} className="surface-card flex w-full items-center gap-4 p-5 text-left">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          event.type === "Vacuna"
            ? "bg-pawbit-blue-bg text-pawbit-blue"
            : event.type === "Control"
              ? "bg-[#fff1df] text-[#de8b14]"
              : "bg-pawbit-error-bg text-pawbit-primary"
        }`}
      >
        {event.type === "Vacuna" ? "💉" : event.type === "Control" ? "✚" : "⏰"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title}</p>
        <p className="text-[15px] text-pawbit-muted">{format(parseISO(event.startDate), "EEEE d MMM, HH:mm", { locale: es })}</p>
      </div>
      <span className="rounded-pill bg-pawbit-error-bg px-3 py-2 text-sm font-semibold text-pawbit-primary">
        {formatUpcomingLabel(event.startDate, today)}
      </span>
    </button>
  );
}

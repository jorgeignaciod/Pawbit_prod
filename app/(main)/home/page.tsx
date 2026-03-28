"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, ClipboardList, HeartPulse, Scale, ShieldCheck, Syringe } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { PetSummaryCard } from "@/components/pets/pet-summary-card";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationButton } from "@/components/ui/notification-button";
import { calendarService } from "@/services/calendar.service";
import { petsService } from "@/services/pets.service";
import { DemoState, resolveDemoState } from "@/lib/demo-state";
import { Pet } from "@/types/pet";
import { CalendarEvent } from "@/types/calendar-event";

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [viewState, setViewState] = useState<DemoState>("default");
  const selectedPet = useMemo(() => pets[0] ?? null, [pets]);
  const petsCount = pets.length;
  const eventsCount = events.length;

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

    Promise.all([petsService.getPets(), calendarService.getEvents()]).then(([petsData, eventsData]) => {
      setPets(nextViewState === "empty" ? [] : petsData);
      setEvents(nextViewState === "empty" ? [] : eventsData);
      setStatus("success");
    });
  }, []);

  return (
    <AppShell
      title="Inicio"
      subtitle="Inicio"
      chrome="plain"
      hideTopBarTitle
      topBarLeading={<h1 className="text-[28px] font-semibold tracking-[-0.03em] text-pawbit-text">Hola, Jorge</h1>}
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

            {events.length ? (
              <div className="surface-card overflow-hidden p-0">
                {events.slice(0, 3).map((event, index) => {
                  const tone =
                    index === 0
                      ? "bg-pawbit-blue-bg text-pawbit-blue"
                      : index === 1
                        ? "bg-pawbit-success-bg text-pawbit-success"
                        : "bg-[#fff1df] text-[#de8b14]";
                  const suffix = index === 0 ? "En 5 días" : index === 1 ? "Mañana" : "18 feb";

                  return (
                    <div key={event.id} className={`flex items-center gap-4 px-5 py-4 ${index < 2 ? "border-b border-pawbit-stroke/80" : ""}`}>
                      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
                        {index === 0 ? <Syringe className="h-6 w-6" /> : index === 1 ? <CalendarPlus className="h-6 w-6" /> : <HeartPulse className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[18px] font-semibold text-pawbit-text">{event.title.replace(/^.* de /, "")}</p>
                        <p className="text-[15px] text-pawbit-muted">
                          {index === 0 ? "Recordatorio médico" : index === 1 ? "Preventivo" : "Chequeo anual"}
                        </p>
                      </div>
                      <p className={`text-[15px] font-semibold ${index === 0 ? "text-pawbit-blue" : index === 1 ? "text-pawbit-success" : "text-pawbit-muted"}`}>
                        {suffix}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={petsCount > 1 ? "No hay eventos próximos para tus mascotas" : "No hay eventos próximos para tu mascota"}
                description={
                  petsCount > 1
                    ? "Cuando registres vacunas o controles de tus mascotas aparecerán aquí."
                    : "Cuando registres vacunas o controles de tu mascota aparecerán aquí."
                }
              />
            )}

            <SectionHeader title={pets.length > 1 ? "Resumen de tus mascotas" : "Resumen de tu mascota"} />
            {pets.length ? (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/pets/${pet.id}`}
                    className="surface-card block bg-pawbit-surface p-6"
                  >
                    <div className="space-y-5">
                      <h3 className="text-[22px] font-medium tracking-[-0.03em] text-pawbit-text">{pet.name}</h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <ShieldCheck className="h-8 w-8 text-[#20b887]" strokeWidth={2.2} />
                          <p className="text-[18px] text-pawbit-text">
                            Vacunas: <span className="font-medium">Al día</span> <span aria-hidden="true">✅</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <Scale className="h-8 w-8 text-pawbit-primary" strokeWidth={2.2} />
                          <p className="text-[18px] text-pawbit-text">
                            Último peso: <span className="font-medium">{pet.id === "pet-1" ? "12,4 kg" : "5,8 kg"}</span>{" "}
                            <span className="text-[#91a0bb]">(hace {pet.id === "pet-1" ? "12" : "20"} días)</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <ClipboardList className="h-8 w-8 text-[#91a0bb]" strokeWidth={2.2} />
                          <p className="text-[18px] text-pawbit-text">
                            Último registro: <span className="font-medium">{pet.id === "pet-1" ? "ayer" : "hace 4 días"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
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

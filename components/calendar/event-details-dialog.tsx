"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { petsMock } from "@/mocks/pets.mock";
import { useEventDetailsStore } from "@/store/event-details-store";

export function EventDetailsDialog() {
  const selectedEvent = useEventDetailsStore((state) => state.selectedEvent);
  const closeEventDetails = useEventDetailsStore((state) => state.closeEventDetails);

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeEventDetails();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeEventDetails, selectedEvent]);

  if (!selectedEvent) {
    return null;
  }

  const pet = petsMock.find((currentPet) => currentPet.id === selectedEvent.petId) ?? null;
  const petName = pet?.name ?? "Mascota";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1e2742]/28 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-8 backdrop-blur-[2px] sm:items-center" onClick={closeEventDetails}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
        className="w-full max-w-md rounded-[38px] border border-white/70 bg-white/78 p-6 shadow-card backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {pet ? (
              <div className="h-[82px] w-[82px] overflow-hidden rounded-[22px] bg-pawbit-blue-bg">
                <Image src={pet.avatar} alt={pet.name} width={82} height={82} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-[82px] w-[82px] rounded-[22px] bg-pawbit-blue-bg" />
            )}
            <div className="min-w-0">
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-pawbit-text">{petName}</p>
              <p className="mt-2 inline-flex rounded-pill bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-pawbit-muted">
                {selectedEvent.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEventDetails}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/75 text-pawbit-text shadow-soft"
            aria-label="Cerrar detalle del evento"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 px-1 pb-2 pt-10">
          <div>
            <p className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#9caac2]">Evento</p>
            <h2 id="event-details-title" className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] text-pawbit-text">
              {selectedEvent.title}
            </h2>
          </div>

          <div>
            <p className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#9caac2]">Fecha</p>
            <p className="mt-3 text-[28px] font-medium leading-tight text-pawbit-text">
              {format(parseISO(selectedEvent.startDate), "d 'de' MMMM", { locale: es })}
            </p>
            <p className="mt-1 text-[20px] text-pawbit-muted">
              {format(parseISO(selectedEvent.startDate), "HH:mm", { locale: es })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

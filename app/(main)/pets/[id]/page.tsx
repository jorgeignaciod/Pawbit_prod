import Image from "next/image";
import Link from "next/link";
import { Ellipsis, Pencil, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { PetNextEventCard } from "@/components/calendar/pet-next-event-card";
import { calendarEventsMock } from "@/mocks/calendar-events.mock";
import { petsMock } from "@/mocks/pets.mock";
import { petsService } from "@/services/pets.service";
import { formatAgeLabel } from "@/lib/utils";

export function generateStaticParams() {
  return petsMock.map((pet) => ({ id: pet.id }));
}

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = await petsService.getPetById(id);

  if (!pet) {
    notFound();
  }

  const nextEvent = calendarEventsMock.find((event) => event.petId === pet.id);

  return (
    <AppShell
      title="Gus"
      subtitle="Detalle de Mascota"
      chrome="plain"
      hideTopBarTitle
      topBarAction={
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
          <Ellipsis className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-0">
        <div className="relative -mx-2 overflow-hidden rounded-[32px]">
          <Image src={pet.avatar} alt={pet.name} width={800} height={640} className="h-[330px] w-full object-cover" />
          <Link href="/pets" className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <section className="-mt-7 rounded-t-[34px] bg-pawbit-background px-6 pb-6 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[54px] font-bold leading-none tracking-[-0.05em] text-pawbit-text">{pet.name}</h1>
              <div className="mt-3 space-y-2">
                <div className="inline-flex rounded-pill bg-pawbit-chip-active px-3 py-1 text-sm font-semibold text-pawbit-primary">
                  {pet.species.toUpperCase()}
                </div>
                <p className="text-[15px] text-pawbit-muted">
                  {pet.species}
                  {pet.microchipNumber ? ` · Microchip: ${pet.microchipNumber}` : ""}
                </p>
              </div>
            </div>
            <button type="button" className="flex h-14 w-14 items-center justify-center rounded-full bg-pawbit-primary text-white shadow-coral">
              <Pencil className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex border-b border-pawbit-stroke">
            <span className="border-b-2 border-pawbit-primary px-4 pb-4 text-[15px] font-semibold text-pawbit-primary">Resumen</span>
            <Link href={`/pets/${pet.id}/health`} className="px-6 pb-4 text-[15px] text-pawbit-muted">Salud</Link>
            <span className="px-6 pb-4 text-[15px] text-pawbit-muted">Documentos</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <StatBox label="Edad" value={formatAgeLabel(pet.birthDate)} />
            <StatBox label="Sexo" value={pet.sex} />
            <StatBox label="Peso" value={`${pet.weight} kg`} />
            <StatBox label="Estado" value={getNeuteredLabel(pet.sex, pet.neutered)} />
          </div>

          <div className="mt-8">
            <p className="section-kicker">Próximo</p>
            {nextEvent ? (
              <PetNextEventCard event={nextEvent} />
            ) : null}
          </div>

          <Link href="/register" className="mt-8 flex h-[58px] items-center justify-center rounded-pill bg-pawbit-primary text-[17px] font-semibold text-white shadow-coral">
            Registrar algo
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-[22px] p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa8c0]">{label}</p>
      <p className="mt-2 text-[18px] font-semibold text-pawbit-text">{value}</p>
    </div>
  );
}

function getNeuteredLabel(sex: "Macho" | "Hembra", neutered: boolean) {
  if (neutered) {
    return sex === "Hembra" ? "Esterilizada" : "Castrado";
  }

  return sex === "Hembra" ? "No esterilizada" : "No castrado";
}

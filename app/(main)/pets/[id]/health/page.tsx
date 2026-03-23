"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Ellipsis, Search } from "lucide-react";
import { useParams } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { HealthFilterBar } from "@/components/health/health-filter-bar";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { TimelineList } from "@/components/health/timeline-list";
import { DemoState, resolveDemoState } from "@/lib/demo-state";
import { petsService } from "@/services/pets.service";
import { recordsService } from "@/services/records.service";
import { HealthRecord } from "@/types/health-record";
import { Pet } from "@/types/pet";

export default function PetHealthPage() {
  const params = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filter, setFilter] = useState("Todos");
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

    Promise.all([petsService.getPetById(params.id), recordsService.getRecordsByPetId(params.id)]).then(([petData, recordsData]) => {
      setPet(petData);
      setRecords(nextViewState === "empty" ? [] : recordsData);
      setStatus("success");
    });
  }, [params.id]);

  const visibleRecords = filter === "Todos" ? records : records.filter((record) => record.type === filter);

  return (
    <AppShell
      title={pet?.name ?? "Salud"}
      subtitle="Detalle Mascota: Salud"
      chrome="plain"
      topBarAction={
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
          <Ellipsis className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-0">
        {pet ? (
          <div className="relative -mx-2 overflow-hidden rounded-[30px]">
            <Image src={pet.avatar} alt={pet.name} width={900} height={520} className="h-[230px] w-full object-cover" />
            <Link href={`/pets/${params.id}`} className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="absolute bottom-6 left-6">
              <h1 className="text-[44px] font-bold leading-none tracking-[-0.05em] text-white">{pet.name}</h1>
              <div className="mt-3 flex gap-2">
                <span className="rounded-pill bg-pawbit-primary px-3 py-1 text-xs font-semibold text-white">{pet.species.toUpperCase()}</span>
                <span className="rounded-pill bg-white/75 px-3 py-1 text-xs font-semibold text-pawbit-text">{pet.sex.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ) : null}

        <section className="bg-pawbit-background px-2 pb-6 pt-5">
          <div className="rounded-pill bg-pawbit-error-bg px-1 py-1">
            <div className="grid grid-cols-3 gap-1">
              <Link href={`/pets/${params.id}`} className="rounded-pill px-4 py-3 text-center text-[16px] font-medium text-pawbit-primary">
                Resumen
              </Link>
              <button className="rounded-pill bg-white px-4 py-3 text-[16px] font-semibold text-pawbit-primary shadow-soft">
                Salud
              </button>
              <button className="rounded-pill px-4 py-3 text-[16px] font-medium text-pawbit-primary">
                Documentos
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-semibold text-pawbit-text">Historial médico</h2>
            <div className="flex items-center gap-3">
              <div className="rounded-pill border border-pawbit-error-border bg-white px-4 py-2 text-[15px] text-pawbit-text">Todo ⌄</div>
              <Search className="h-5 w-5 text-pawbit-primary" />
            </div>
          </div>

          <div className="mt-6">
            <HealthFilterBar value={filter} onChange={setFilter} />
          </div>

          {viewState === "success" ? <div className="mt-5 rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">Historial actualizado correctamente.</div> : null}
          {status === "loading" ? <div className="mt-5"><LoadingCard label="Cargando historial médico..." /></div> : null}
          {status === "error" ? <div className="mt-5"><ErrorCard title="No pudimos cargar el historial" description="Vuelve a intentar para consultar vacunas, consultas y tratamientos." onRetry={() => window.location.reload()} /></div> : null}
          {status === "success" ? (
            visibleRecords.length ? (
              <div className="mt-6">
                <TimelineList records={visibleRecords} />
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState title="Sin registros en este filtro" description="Prueba otro tipo o registra un nuevo evento de salud." />
              </div>
            )
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

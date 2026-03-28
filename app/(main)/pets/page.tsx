"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { PetCard } from "@/components/pets/pet-card";
import { EmptyState } from "@/components/ui/empty-state";
import { resolveDemoState } from "@/lib/demo-state";
import { petsService } from "@/services/pets.service";
import { Pet } from "@/types/pet";

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    const viewState = resolveDemoState(new URLSearchParams(window.location.search).get("state"));

    if (viewState === "loading") {
      setStatus("loading");
      return;
    }

    if (viewState === "error") {
      setStatus("error");
      return;
    }

    petsService.getPets().then((data) => {
      setPets(viewState === "empty" ? [] : data);
      setStatus("success");
    });
  }, []);

  return (
    <AppShell
      title="Tus Mascotas"
      subtitle="Mascotas"
      chrome="plain"
      hideTopBarTitle
      topBarLeading={<h1 className="text-[28px] font-semibold tracking-[-0.03em] text-pawbit-text">Tus Mascotas</h1>}
      topBarAction={
        <button type="button" className="relative flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft" aria-label="Notificaciones">
          <Bell className="h-6 w-6" />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-pawbit-primary" />
        </button>
      }
    >
      <div className="space-y-5">
        {status === "loading" ? <LoadingCard label={pets.length > 1 ? "Cargando tus mascotas..." : "Cargando tu mascota..."} /> : null}
        {status === "error" ? (
          <ErrorCard
            title={pets.length > 1 ? "No pudimos listar tus mascotas" : "No pudimos cargar tu mascota"}
            description={
              pets.length > 1
                ? "Reintenta para volver a cargar las fichas registradas."
                : "Reintenta para volver a cargar la ficha registrada."
            }
            onRetry={() => window.location.reload()}
          />
        ) : null}

        {status === "success" ? (
          pets.length ? (
            <>
              <div className="space-y-4">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
              <Link href="/pets/new" className="surface-card block border-dashed bg-transparent py-12 text-center text-pawbit-hint">
                <p className="mb-2 text-3xl">🐾</p>
                <p className="text-[16px]">{pets.length > 1 ? "¿Quieres agregar otra mascota?" : "¿Tienes otra mascota?"}</p>
                <p className="mt-2 text-[16px] font-semibold text-pawbit-primary">Añadir mascota</p>
              </Link>
            </>
          ) : (
            <EmptyState
              title="Sin mascotas registradas"
              description="Agrega tu primera mascota para empezar a construir su historial."
              actionLabel="Añadir mascota"
              onAction={() => {
                window.location.href = "/pets/new";
              }}
            />
          )
        ) : null}
      </div>
    </AppShell>
  );
}

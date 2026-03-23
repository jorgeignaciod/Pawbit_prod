"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronDown, ChevronRight, Clock3 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { FormField } from "@/components/forms/form-field";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { petsMock } from "@/mocks/pets.mock";
import { resolveDemoState } from "@/lib/demo-state";

const schema = z.object({
  petId: z.string().min(1, "Selecciona una mascota"),
  vaccineName: z.string().min(3, "Ingresa el nombre de la vacuna"),
  dose: z.string().min(1, "Ingresa la dosis"),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function RegisterVaccinePage() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduleNextDose, setScheduleNextDose] = useState(false);
  const [viewState] = useState(() =>
    typeof window === "undefined" ? "default" : resolveDemoState(new URLSearchParams(window.location.search).get("state"))
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      petId: petsMock[0]?.id ?? "",
      vaccineName: "",
      dose: "",
      notes: ""
    }
  });

  async function onSubmit() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSaving(false);
    setSubmitted(true);
  }

  const activePet = petsMock.find((pet) => pet.id === form.watch("petId")) ?? petsMock[0];

  return (
    <AppShell title="Registrar" subtitle="Registrar Vacuna" chrome="plain">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/register" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
            <ArrowLeft className="h-5 w-5 text-pawbit-text" />
          </Link>
          <div className="flex-1 text-center text-[20px] font-semibold text-pawbit-text">Registrar</div>
          <div className="w-12" />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          <Link href="/register" className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Peso</Link>
          <button className="rounded-pill bg-pawbit-primary px-6 py-3 text-[16px] font-semibold text-white shadow-coral">Vacuna</button>
          <button className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Medicación</button>
          <button className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Nota</button>
        </div>

        {viewState === "loading" || saving ? <LoadingCard label="Guardando registro de vacuna..." /> : null}
        {viewState === "error" ? <ErrorCard title="No se pudo guardar la vacuna" description="Revisa los datos e intenta nuevamente." /> : null}
        {(viewState === "success" || submitted) && <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">Vacuna registrada correctamente.</div>}

        <form className="surface-card space-y-5 p-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField label="Mascota" error={form.formState.errors.petId?.message}>
            <button type="button" className="flex w-full items-center gap-4 rounded-[22px] bg-pawbit-input-alt px-5 py-4">
              <Image src={activePet.avatar} alt={activePet.name} width={48} height={48} className="rounded-full object-cover" />
              <span className="flex-1 text-left text-[18px] font-semibold text-pawbit-text">{activePet.name}</span>
              <ChevronDown className="h-5 w-5 text-pawbit-hint" />
            </button>
          </FormField>

          <FormField label="Fecha y hora">
            <button type="button" className="flex w-full items-center gap-4 rounded-[22px] bg-pawbit-input-alt px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary">
                <Clock3 className="h-5 w-5" />
              </span>
              <span className="flex-1 text-left text-[18px] font-semibold text-pawbit-text">Ahora</span>
              <ChevronRight className="h-5 w-5 text-pawbit-hint" />
            </button>
          </FormField>

          <FormField label="Vacuna" error={form.formState.errors.vaccineName?.message}>
            <Input placeholder="Ej: Rabia" {...form.register("vaccineName")} />
          </FormField>

          <FormField label="Dosis" error={form.formState.errors.dose?.message}>
            <Input placeholder="Ej: 1 ml" {...form.register("dose")} />
          </FormField>

          <div className="flex items-center justify-between gap-4 py-2">
            <p className="text-[16px] font-semibold text-pawbit-text">Programar próxima dosis</p>
            <button
              type="button"
              onClick={() => setScheduleNextDose((value) => !value)}
              className={`flex h-9 w-16 items-center rounded-pill p-1 ${scheduleNextDose ? "bg-pawbit-primary" : "bg-[#d9e1ef]"}`}
            >
              <span className={`h-7 w-7 rounded-full bg-white shadow-soft transition ${scheduleNextDose ? "ml-auto" : ""}`} />
            </button>
          </div>

          <FormField label="Nota" helper="Opcional" error={form.formState.errors.notes?.message}>
            <textarea
              className="min-h-[120px] w-full rounded-[26px] border border-pawbit-stroke bg-pawbit-input-alt px-5 py-4 text-[16px] text-pawbit-text outline-none"
              placeholder="Añade algún detalle..."
              {...form.register("notes")}
            />
          </FormField>

          <PrimaryButton type="submit" disabled={saving}>
            Guardar registro
          </PrimaryButton>
        </form>
      </div>
    </AppShell>
  );
}

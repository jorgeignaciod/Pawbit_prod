"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronDown, ChevronRight, Clock3, Pill } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { FormField } from "@/components/forms/form-field";
import { ErrorCard, LoadingCard } from "@/components/feedback/state-card";
import { resolveDemoState } from "@/lib/demo-state";
import { petsMock } from "@/mocks/pets.mock";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";

const schema = z.object({
  petId: z.string().min(1, "Selecciona una mascota"),
  medicationName: z.string().min(2, "Ingresa el nombre del medicamento"),
  dose: z.string().min(1, "Ingresa la dosis"),
  frequency: z.string().min(2, "Ingresa la frecuencia"),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function RegisterMedicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduleReminder, setScheduleReminder] = useState(true);
  const [viewState] = useState(() =>
    typeof window === "undefined" ? "default" : resolveDemoState(new URLSearchParams(window.location.search).get("state"))
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      petId: petsMock[0]?.id ?? "",
      medicationName: "",
      dose: "",
      frequency: "",
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
    <AppShell
      title="Registrar"
      subtitle="Registrar medicación"
      chrome="plain"
      centerTopBarTitle
      topBarLeading={
        <Link href="/register" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
          <ArrowLeft className="h-5 w-5 text-pawbit-text" />
        </Link>
      }
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-6">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <Link href="/register" className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Peso</Link>
          <Link href="/register/vaccine" className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Vacuna</Link>
          <button className="rounded-pill bg-pawbit-primary px-6 py-3 text-[16px] font-semibold text-white shadow-coral">Medicación</button>
          <Link href="/register/note" className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Nota</Link>
        </div>

        {viewState === "loading" || saving ? <LoadingCard label="Guardando registro de medicación..." /> : null}
        {viewState === "error" ? <ErrorCard title="No se pudo guardar la medicación" description="Revisa los datos e intenta nuevamente." /> : null}
        {(viewState === "success" || submitted) && (
          <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">Medicación registrada correctamente.</div>
        )}

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

          <FormField label="Medicamento" error={form.formState.errors.medicationName?.message}>
            <Input placeholder="Ej: Carprofeno" {...form.register("medicationName")} />
          </FormField>

          <FormField label="Dosis" error={form.formState.errors.dose?.message}>
            <Input placeholder="Ej: 1 comprimido" {...form.register("dose")} />
          </FormField>

          <FormField label="Frecuencia" error={form.formState.errors.frequency?.message}>
            <Input placeholder="Ej: Cada 12 horas por 5 días" {...form.register("frequency")} />
          </FormField>

          <div className="flex items-center justify-between gap-4 py-2">
            <p className="text-[16px] font-semibold text-pawbit-text">Programar recordatorio</p>
            <button
              type="button"
              onClick={() => setScheduleReminder((value) => !value)}
              className={`flex h-9 w-16 items-center rounded-pill p-1 ${scheduleReminder ? "bg-pawbit-primary" : "bg-[#d9e1ef]"}`}
            >
              <span className={`h-7 w-7 rounded-full bg-white shadow-soft transition ${scheduleReminder ? "ml-auto" : ""}`} />
            </button>
          </div>

          <FormField label="Nota" helper="Opcional" error={form.formState.errors.notes?.message}>
            <textarea
              className="min-h-[120px] w-full rounded-[26px] border border-pawbit-stroke bg-pawbit-input-alt px-5 py-4 text-[16px] text-pawbit-text outline-none"
              placeholder="Ej: Dar después de comer. Revisar si mejora la cojera."
              {...form.register("notes")}
            />
          </FormField>

          <div className="rounded-[22px] border border-dashed border-pawbit-stroke bg-pawbit-input-alt px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary">
                <Pill className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[16px] font-medium text-pawbit-text">Adjuntar indicación médica</p>
                <p className="text-sm text-pawbit-muted">Placeholder para receta o documento.</p>
              </div>
            </div>
          </div>

          <PrimaryButton type="submit" disabled={saving}>
            Guardar registro
          </PrimaryButton>
        </form>
      </div>
    </AppShell>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, ChevronDown } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { petsService } from "@/services/pets.service";
import { recordsService } from "@/services/records.service";
import { Pet } from "@/types/pet";
import { PrimaryButton } from "@/components/ui/primary-button";
import { FormField } from "@/components/forms/form-field";
import { CompactConfirmationDialog } from "@/components/ui/compact-confirmation-dialog";

const schema = z.object({
  petId: z.string().min(1, "Selecciona una mascota"),
  weight: z
    .string()
    .min(1, "Ingresa el peso")
    .refine((value) => {
      const normalized = Number(value.replace(",", "."));

      return Number.isFinite(normalized) && normalized > 0;
    }, "Ingresa un peso valido"),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      petId: "",
      weight: "",
      notes: ""
    }
  });

  useEffect(() => {
    petsService
      .getPets()
      .then((data) => {
        setPets(data);
        if (data[0]) {
          form.setValue("petId", data[0].id, { shouldValidate: true });
        }
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [form]);

  const activePet = useMemo(
    () => pets.find((pet) => pet.id === form.watch("petId")) ?? pets[0] ?? null,
    [pets, form]
  );

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setSubmitted(false);
    setSubmitError(null);

    try {
      await recordsService.createWeightRecord({
        petId: values.petId,
        weight: Number(values.weight.replace(",", ".")),
        notes: values.notes
      });
      setSubmitted(true);
      form.reset({
        petId: values.petId,
        weight: "",
        notes: ""
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos guardar el peso.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      title="Registrar"
      subtitle="Registrar"
      chrome="plain"
      centerTopBarTitle
      topBarLeading={
        <Link href="/home" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
          <ArrowLeft className="h-5 w-5 text-pawbit-text" />
        </Link>
      }
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-6">
        {status === "loading" || saving ? <LoadingCard label={saving ? "Guardando peso..." : "Cargando tus mascotas..."} /> : null}
        {status === "error" ? <ErrorCard title="No pudimos cargar tus mascotas" description="Intenta nuevamente para registrar información." onRetry={() => window.location.reload()} /> : null}
        {submitError ? <ErrorCard title="No pudimos guardar el peso" description={submitError} /> : null}

        <div className="flex gap-3 overflow-x-auto pb-1">
          <button className="rounded-pill bg-pawbit-primary px-6 py-3 text-[16px] font-semibold text-white shadow-coral">Peso</button>
          <Link href="/register/vaccine" className="rounded-pill bg-pawbit-error-bg px-6 py-3 text-[16px] font-medium text-pawbit-primary">Vacuna</Link>
          <Link href="/register/medication" className="rounded-pill bg-pawbit-error-bg px-6 py-3 text-[16px] font-medium text-pawbit-primary">Medicación</Link>
          <Link href="/register/note" className="rounded-pill bg-pawbit-error-bg px-6 py-3 text-[16px] font-medium text-pawbit-primary">Nota</Link>
        </div>

        {status === "success" ? (
          activePet ? (
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <input type="hidden" {...form.register("petId")} />
              <div className="space-y-6">
                <FormField label="Mascota" error={form.formState.errors.petId?.message}>
                  <button type="button" className="surface-card flex w-full items-center gap-4 p-4">
                    <Image src={activePet.avatar} alt={activePet.name} width={48} height={48} className="rounded-full object-cover" />
                    <span className="flex-1 text-left text-[18px] font-semibold text-pawbit-text">{activePet.name}</span>
                    <ChevronDown className="h-5 w-5 text-pawbit-primary" />
                  </button>
                </FormField>

                <div className="space-y-3">
                  <p className="text-[16px] font-semibold text-pawbit-text">Fecha y hora</p>
                  <button type="button" className="surface-card flex w-full items-center gap-4 p-4">
                    <span className="flex-1 text-left text-[18px] text-pawbit-text">Ahora</span>
                    <CalendarDays className="h-5 w-5 text-pawbit-primary" />
                  </button>
                </div>

                <FormField label="Peso (kg)" error={form.formState.errors.weight?.message}>
                  <div className="relative">
                    <Input placeholder="Ej: 8.2" className="pr-14" {...form.register("weight")} />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-pawbit-hint">kg</span>
                  </div>
                </FormField>

                <FormField label={<span>Nota <span className="font-normal text-pawbit-hint">(Opcional)</span></span>}>
                  <textarea
                    className="min-h-[140px] w-full rounded-[32px] border border-pawbit-stroke bg-white px-5 py-4 text-[16px] text-pawbit-text outline-none"
                    placeholder="Añade algún detalle..."
                    {...form.register("notes")}
                  />
                </FormField>
              </div>

              <PrimaryButton type="submit" disabled={saving}>
                Guardar registro
              </PrimaryButton>
            </form>
          ) : (
            <EmptyState
              title="No tienes mascotas para registrar"
              description="Agrega una mascota primero para poder guardar peso, vacunas o notas."
              actionLabel="Añadir mascota"
              onAction={() => {
                window.location.href = "/pets/new";
              }}
            />
          )
        ) : null}
      </div>
      <CompactConfirmationDialog
        open={submitted}
        title="Peso registrado correctamente"
        description="El resumen de tu mascota ya puede reflejar este nuevo dato."
        onConfirm={() => setSubmitted(false)}
        onClose={() => setSubmitted(false)}
      />
    </AppShell>
  );
}

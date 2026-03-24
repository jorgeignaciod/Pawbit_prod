"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronDown, ChevronRight, Clock3, FileText } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { FormField } from "@/components/forms/form-field";
import { ErrorCard, LoadingCard } from "@/components/feedback/state-card";
import { resolveDemoState } from "@/lib/demo-state";
import { petsMock } from "@/mocks/pets.mock";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";

const schema = z.object({
  petId: z.string().min(1, "Selecciona una mascota"),
  title: z.string().min(2, "Ingresa un título corto"),
  content: z.string().min(6, "Agrega una nota útil"),
  tag: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function RegisterNotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewState] = useState(() =>
    typeof window === "undefined" ? "default" : resolveDemoState(new URLSearchParams(window.location.search).get("state"))
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      petId: petsMock[0]?.id ?? "",
      title: "",
      content: "",
      tag: ""
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
      subtitle="Registrar nota"
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
          <Link href="/register/medication" className="rounded-pill bg-white px-6 py-3 text-[16px] font-medium text-pawbit-text shadow-soft">Medicación</Link>
          <button className="rounded-pill bg-pawbit-primary px-6 py-3 text-[16px] font-semibold text-white shadow-coral">Nota</button>
        </div>

        {viewState === "loading" || saving ? <LoadingCard label="Guardando nota..." /> : null}
        {viewState === "error" ? <ErrorCard title="No se pudo guardar la nota" description="Intenta nuevamente en unos segundos." /> : null}
        {(viewState === "success" || submitted) && (
          <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">Nota registrada correctamente.</div>
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

          <FormField label="Título" error={form.formState.errors.title?.message}>
            <Input placeholder="Ej: Observación post consulta" {...form.register("title")} />
          </FormField>

          <FormField label="Etiqueta" helper="Opcional" error={form.formState.errors.tag?.message}>
            <Input placeholder="Ej: General, conducta, apetito" {...form.register("tag")} />
          </FormField>

          <FormField label="Nota" error={form.formState.errors.content?.message}>
            <textarea
              className="min-h-[140px] w-full rounded-[26px] border border-pawbit-stroke bg-pawbit-input-alt px-5 py-4 text-[16px] text-pawbit-text outline-none"
              placeholder="Ej: Hoy comió menos de lo habitual pero mantuvo buen ánimo. Observar evolución durante la tarde."
              {...form.register("content")}
            />
          </FormField>

          <div className="rounded-[22px] border border-dashed border-pawbit-stroke bg-pawbit-input-alt px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[16px] font-medium text-pawbit-text">Adjuntar respaldo</p>
                <p className="text-sm text-pawbit-muted">Placeholder para examen, receta o foto de apoyo.</p>
              </div>
            </div>
          </div>

          <PrimaryButton type="submit" disabled={saving}>
            Guardar nota
          </PrimaryButton>
        </form>
      </div>
    </AppShell>
  );
}

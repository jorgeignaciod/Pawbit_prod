"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppShell } from "@/components/layout/app-shell";
import { FormField } from "@/components/forms/form-field";
import { SelectField } from "@/components/forms/select-field";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";

const petSchema = z.object({
  name: z.string().min(2, "Ingresa el nombre"),
  species: z.enum(["Perro", "Gato"]),
  breed: z.string().min(2, "Ingresa la raza"),
  sex: z.enum(["Macho", "Hembra"]),
  color: z.string().min(2, "Ingresa el color"),
  weight: z.string().optional()
});

type PetFormValues = z.infer<typeof petSchema>;

export default function NewPetPage() {
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "Perro",
      breed: "",
      sex: "Macho",
      color: "",
      weight: ""
    }
  });

  const photoPreview = useMemo(() => photoUrl, [photoUrl]);

  async function onSubmit() {
    setSaveError(false);
    setSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSubmitted(true);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPhotoUrl(localUrl);
  }

  return (
    <AppShell title="Añadir mascota" subtitle="Mascotas" chrome="plain" hideTopBarTitle>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/pets" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
            <ArrowLeft className="h-5 w-5 text-pawbit-text" />
          </Link>
          <div className="flex-1 text-center text-[20px] font-semibold text-pawbit-text">Añadir mascota</div>
          <div className="w-12" />
        </div>

        {saving ? <LoadingCard label="Guardando nueva mascota..." /> : null}
        {saveError ? <ErrorCard title="No pudimos guardar la mascota" description="Revisa los datos e intenta nuevamente." /> : null}
        {submitted ? (
          <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">
            La mascota se creó correctamente. El siguiente paso es comenzar a registrar su salud.
          </div>
        ) : null}

        <form className="surface-card space-y-5 p-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField label="Fotografía" helper="Opcional. Puedes agregarla ahora o después.">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div className="flex min-h-[180px] items-center justify-center rounded-[24px] border border-dashed border-pawbit-stroke bg-pawbit-input-alt p-4">
                {photoPreview ? (
                  <Image src={photoPreview} alt="Vista previa de mascota" width={220} height={180} className="max-h-[180px] w-auto rounded-[20px] object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <p className="text-[16px] font-medium text-pawbit-text">Subir fotografía</p>
                    <p className="mt-1 text-sm text-pawbit-muted">PNG o JPG para identificar mejor a tu mascota.</p>
                  </div>
                )}
              </div>
            </label>
          </FormField>

          <FormField label="Nombre" error={form.formState.errors.name?.message}>
            <Input placeholder="Ej: Luna" {...form.register("name")} />
          </FormField>

          <FormField label="Especie" error={form.formState.errors.species?.message}>
            <SelectField {...form.register("species")}>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
            </SelectField>
          </FormField>

          <FormField label="Raza" error={form.formState.errors.breed?.message}>
            <Input placeholder="Ej: Dachshund" {...form.register("breed")} />
          </FormField>

          <FormField label="Sexo" error={form.formState.errors.sex?.message}>
            <SelectField {...form.register("sex")}>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </SelectField>
          </FormField>

          <FormField label="Color" error={form.formState.errors.color?.message}>
            <Input placeholder="Ej: Canela" {...form.register("color")} />
          </FormField>

          <FormField label="Peso" helper="Opcional" error={form.formState.errors.weight?.message}>
            <Input placeholder="Ej: 8.2 kg" {...form.register("weight")} />
          </FormField>

          <PrimaryButton type="submit" disabled={saving}>
            Guardar mascota
          </PrimaryButton>
        </form>
      </div>
    </AppShell>
  );
}

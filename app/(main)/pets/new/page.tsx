"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppShell } from "@/components/layout/app-shell";
import { FormField } from "@/components/forms/form-field";
import { SearchableCombobox } from "@/components/forms/searchable-combobox";
import { SelectField } from "@/components/forms/select-field";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";

const petSchema = z
  .object({
    name: z.string().min(2, "Ingresa el nombre"),
    species: z.enum(["", "Perro", "Gato"]),
    breed: z.string(),
    sex: z.enum(["Macho", "Hembra"]),
    color: z.string().min(2, "Ingresa el color"),
    isNeutered: z.enum(["", "yes", "no"]),
    hasMicrochip: z.enum(["", "yes", "no"]),
    microchipNumber: z.string().optional(),
    weight: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (!values.species) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona la especie",
        path: ["species"]
      });
    }

    if (!values.breed.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona la raza",
        path: ["breed"]
      });
    }

    if (!values.isNeutered) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una opción",
        path: ["isNeutered"]
      });
    }

    if (!values.hasMicrochip) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una opción",
        path: ["hasMicrochip"]
      });
    }

    if (values.hasMicrochip === "yes" && !values.microchipNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ingresa el número del microchip",
        path: ["microchipNumber"]
      });
    }
  });

type PetFormValues = z.infer<typeof petSchema>;

export default function NewPetPage() {
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [breedOptions, setBreedOptions] = useState<string[]>([]);
  const [breedsLoading, setBreedsLoading] = useState(false);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      sex: "Macho",
      color: "",
      isNeutered: "",
      hasMicrochip: "",
      microchipNumber: "",
      weight: ""
    }
  });

  const photoPreview = useMemo(() => photoUrl, [photoUrl]);
  const selectedSpecies = form.watch("species");
  const hasMicrochip = form.watch("hasMicrochip");

  useEffect(() => {
    if (!selectedSpecies) {
      setBreedOptions([]);
      form.setValue("breed", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    let active = true;

    async function loadBreeds() {
      setBreedsLoading(true);

      const breedsModule = await import("@/constants/pet-breeds");
      const nextOptions =
        selectedSpecies === "Perro"
          ? ([...breedsModule.DOG_BREEDS] as string[])
          : ([...breedsModule.CAT_BREEDS] as string[]);

      if (!active) return;

      setBreedOptions(nextOptions);
      setBreedsLoading(false);

      if (!nextOptions.includes(form.getValues("breed"))) {
        form.setValue("breed", "", { shouldDirty: true, shouldValidate: true });
      }
    }

    void loadBreeds();

    return () => {
      active = false;
    };
  }, [form, selectedSpecies]);

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
    <AppShell
      title="Añadir mascota"
      subtitle="Mascotas"
      chrome="plain"
      centerTopBarTitle
      topBarLeading={
        <Link href="/pets" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
          <ArrowLeft className="h-5 w-5 text-pawbit-text" />
        </Link>
      }
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-6">
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

          <FormField label="Nombre" required error={form.formState.errors.name?.message}>
            <Input placeholder="Ej: Luna" {...form.register("name")} />
          </FormField>

          <FormField label="Especie" required error={form.formState.errors.species?.message}>
            <SelectField {...form.register("species")}>
              <option value="">Selecciona una especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
            </SelectField>
          </FormField>

          <FormField label="Raza" required error={form.formState.errors.breed?.message}>
            <SearchableCombobox
              value={form.watch("breed")}
              options={breedOptions}
              disabled={!selectedSpecies}
              loading={breedsLoading}
              placeholder={selectedSpecies ? "Selecciona una raza" : "Primero selecciona una especie"}
              searchPlaceholder="Buscar raza"
              emptyLabel="No encontramos esa raza. Prueba con otro nombre."
              onChange={(breed) => form.setValue("breed", breed, { shouldDirty: true, shouldValidate: true })}
            />
          </FormField>

          <FormField label="Sexo" required error={form.formState.errors.sex?.message}>
            <SelectField {...form.register("sex")}>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </SelectField>
          </FormField>

          <FormField label="Color" required error={form.formState.errors.color?.message}>
            <Input placeholder="Ej: Canela" {...form.register("color")} />
          </FormField>

          <FormField label="Esterilizado / Castrado" required error={form.formState.errors.isNeutered?.message}>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                label="Sí"
                active={form.watch("isNeutered") === "yes"}
                onClick={() => form.setValue("isNeutered", "yes", { shouldDirty: true, shouldValidate: true })}
              />
              <ChoiceButton
                label="No"
                active={form.watch("isNeutered") === "no"}
                onClick={() => form.setValue("isNeutered", "no", { shouldDirty: true, shouldValidate: true })}
              />
            </div>
          </FormField>

          <FormField label="Microchip" required error={form.formState.errors.hasMicrochip?.message}>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                label="Sí"
                active={hasMicrochip === "yes"}
                onClick={() => form.setValue("hasMicrochip", "yes", { shouldDirty: true, shouldValidate: true })}
              />
              <ChoiceButton
                label="No"
                active={hasMicrochip === "no"}
                onClick={() => form.setValue("hasMicrochip", "no", { shouldDirty: true, shouldValidate: true })}
              />
            </div>
          </FormField>

          {hasMicrochip === "yes" ? (
            <FormField label="Número de microchip" required error={form.formState.errors.microchipNumber?.message}>
              <Input placeholder="Ej: 985141000124578" {...form.register("microchipNumber")} />
            </FormField>
          ) : (
            <div className="rounded-[22px] border border-pawbit-stroke bg-pawbit-input-alt px-5 py-4">
              <p className="text-[15px] text-pawbit-text">
                Si aún no registras el microchip, puedes revisar el proceso oficial en{" "}
                <a
                  href="https://registratumascota.cl"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-pawbit-primary underline underline-offset-2"
                >
                  registratumascota.cl
                </a>
                .
              </p>
            </div>
          )}

          <FormField label="Peso" error={form.formState.errors.weight?.message}>
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

function ChoiceButton({
  active,
  disabled = false,
  label,
  onClick
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-pill px-5 py-3 text-[16px] font-medium transition ${
        active ? "bg-pawbit-primary text-white shadow-coral" : "bg-pawbit-input-alt text-pawbit-text"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {label}
    </button>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppShell } from "@/components/layout/app-shell";
import { FormField } from "@/components/forms/form-field";
import { SearchableCombobox } from "@/components/forms/searchable-combobox";
import { SelectField } from "@/components/forms/select-field";
import { DateField } from "@/components/forms/date-field";
import { LoadingCard, ErrorCard } from "@/components/feedback/state-card";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CompactConfirmationDialog } from "@/components/ui/compact-confirmation-dialog";
import { petsService } from "@/services/pets.service";
import { Pet } from "@/types/pet";

const editPetSchema = z
  .object({
    name: z.string().min(2, "Ingresa el nombre"),
    breed: z.string().min(2, "Selecciona la raza"),
    sex: z.enum(["Macho", "Hembra"]),
    birthDate: z.string().optional(),
    hasMicrochip: z.enum(["yes", "no"]),
    microchipNumber: z.string().optional(),
    avatar: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (values.hasMicrochip === "yes" && !values.microchipNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ingresa el número del microchip",
        path: ["microchipNumber"]
      });
    }
  });

type EditPetFormValues = z.infer<typeof editPetSchema>;

export default function EditPetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [breedOptions, setBreedOptions] = useState<string[]>([]);
  const [breedsLoading, setBreedsLoading] = useState(false);
  const [petId, setPetId] = useState("");

  const form = useForm<EditPetFormValues>({
    resolver: zodResolver(editPetSchema),
    defaultValues: {
      name: "",
      breed: "",
      sex: "Macho",
      birthDate: "",
      hasMicrochip: "no",
      microchipNumber: "",
      avatar: ""
    }
  });

  const avatarValue = form.watch("avatar");
  const hasMicrochip = form.watch("hasMicrochip");
  const photoPreview = useMemo(() => avatarValue || pet?.avatar || "", [avatarValue, pet?.avatar]);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const resolvedPetId = params.id;
        if (!resolvedPetId) {
          setStatus("error");
          return;
        }
        if (!active) return;

        setPetId(resolvedPetId);
        const nextPet = await petsService.getPetById(resolvedPetId);

        if (!active || !nextPet) {
          setStatus("error");
          return;
        }

        setPet(nextPet);
        form.reset({
          name: nextPet.name,
          breed: nextPet.breed,
          sex: nextPet.sex,
          birthDate: nextPet.birthDate || "",
          hasMicrochip: nextPet.microchipNumber ? "yes" : "no",
          microchipNumber: nextPet.microchipNumber ?? "",
          avatar: nextPet.avatar
        });
        setStatus("success");

        setBreedsLoading(true);
        const breedsModule = await import("@/constants/pet-breeds");
        const nextBreeds =
          nextPet.species === "Perro"
            ? [...breedsModule.DOG_BREEDS]
            : [...breedsModule.CAT_BREEDS];

        if (!active) return;

        setBreedOptions(nextBreeds);
        setBreedsLoading(false);
      } catch {
        if (active) {
          setStatus("error");
        }
      }
    }

    void loadPage();

    return () => {
      active = false;
    };
  }, [form, params]);

  async function onSubmit(values: EditPetFormValues) {
    if (!petId) return;

    setSaving(true);
    setSaveError(null);

    try {
      const updatedPet = await petsService.updatePet(petId, {
        name: values.name,
        breed: values.breed,
        sex: values.sex,
        birthDate: values.birthDate || "",
        avatar: values.avatar || "",
        microchipNumber: values.hasMicrochip === "yes" ? values.microchipNumber ?? "" : ""
      });

      setPet(updatedPet);
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No pudimos guardar los cambios.");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      form.setValue("avatar", result, { shouldDirty: true, shouldValidate: true });
    };
    reader.readAsDataURL(file);
  }

  return (
    <AppShell
      title="Editar mascota"
      subtitle="Mascotas"
      chrome="plain"
      centerTopBarTitle
      topBarLeading={
        <Link href={petId ? `/pets/${petId}` : "/pets"} className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
          <ArrowLeft className="h-5 w-5 text-pawbit-text" />
        </Link>
      }
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-6">
        {status === "loading" ? <LoadingCard label="Cargando información de la mascota..." /> : null}
        {status === "error" ? (
          <ErrorCard
            title="No pudimos cargar la mascota"
            description="Intenta nuevamente para editar su información."
            onRetry={() => window.location.reload()}
          />
        ) : null}

        {status === "success" && pet ? (
          <form className="surface-card space-y-5 p-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <h2 className="text-[22px] font-semibold text-pawbit-text">Información básica</h2>
              <p className="text-sm text-pawbit-muted">Actualiza la foto y los datos principales de {pet.name}.</p>
            </div>

            {saveError ? (
              <div className="rounded-[20px] bg-pawbit-error-bg px-4 py-3 text-sm text-pawbit-text">{saveError}</div>
            ) : null}

            <FormField label="Avatar" helper="Puedes cambiar la foto principal que verás en el perfil.">
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <div className="flex min-h-[180px] items-center justify-center rounded-[24px] border border-dashed border-pawbit-stroke bg-pawbit-input-alt p-4">
                  {photoPreview ? (
                    <Image src={photoPreview} alt={`Avatar de ${pet.name}`} width={220} height={180} className="max-h-[180px] w-auto rounded-[20px] object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                      <p className="text-[16px] font-medium text-pawbit-text">Editar avatar</p>
                      <p className="mt-1 text-sm text-pawbit-muted">Sube una imagen PNG o JPG.</p>
                    </div>
                  )}
                </div>
              </label>
            </FormField>

            <div className="rounded-[22px] border border-pawbit-stroke bg-pawbit-input-alt px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pawbit-hint">Especie</p>
              <p className="mt-2 text-[16px] font-medium text-pawbit-text">{pet.species}</p>
            </div>

            <FormField label="Nombre" required error={form.formState.errors.name?.message}>
              <Input placeholder="Ej: Luna" {...form.register("name")} />
            </FormField>

            <FormField label="Raza" required error={form.formState.errors.breed?.message}>
              <SearchableCombobox
                value={form.watch("breed")}
                options={breedOptions}
                loading={breedsLoading}
                placeholder="Selecciona una raza"
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

            <FormField label="Fecha de nacimiento" error={form.formState.errors.birthDate?.message}>
              <DateField {...form.register("birthDate")} />
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

            <PrimaryButton type="submit" disabled={saving}>
              Guardar cambios
            </PrimaryButton>
          </form>
        ) : null}
      </div>

      <CompactConfirmationDialog
        open={saved}
        title={pet ? `${pet.name} fue actualizado correctamente` : "Mascota actualizada"}
        description="Los cambios ya se reflejan en el perfil de la mascota."
        onConfirm={() => {
          setSaved(false);
          if (petId) {
            router.push(`/pets/${petId}`);
          }
        }}
        onClose={() => setSaved(false)}
      />
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

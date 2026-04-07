"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CITY_OPTIONS_BY_COUNTRY, COUNTRY_OPTIONS, SupportedCountry } from "@/constants/locations";
import { FormField } from "@/components/forms/form-field";
import { SelectField } from "@/components/forms/select-field";
import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CompactConfirmationDialog } from "@/components/ui/compact-confirmation-dialog";
import { useAppStore } from "@/store/app-store";

const countrySchema = z.enum(COUNTRY_OPTIONS);

const profileSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un correo valido"),
  phone: z.string().min(8, "Ingresa un telefono valido"),
  country: countrySchema,
  city: z.string().min(2, "Selecciona tu ciudad"),
  documentType: z.enum(["RUT", "DNI"]),
  documentNumber: z.string().min(5, "Ingresa tu documento")
}).superRefine((values, ctx) => {
  const allowedCities = CITY_OPTIONS_BY_COUNTRY[values.country] as readonly string[];

  if (!allowedCities.includes(values.city)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecciona una ciudad valida para ese pais",
      path: ["city"]
    });
  }
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [saved, setSaved] = useState(false);
  const initialCountry = COUNTRY_OPTIONS.includes((user?.country ?? "") as SupportedCountry) ? (user?.country as SupportedCountry) : "Chile";

  const defaultValues = useMemo<ProfileFormValues>(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      country: initialCountry,
      city: user?.city ?? "",
      documentType: user?.documentType ?? "RUT",
      documentNumber: user?.documentNumber ?? ""
    }),
    [initialCountry, user]
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues
  });
  const selectedCountry = form.watch("country");
  const cityOptions = (CITY_OPTIONS_BY_COUNTRY[selectedCountry as SupportedCountry] ?? []) as readonly string[];

  useEffect(() => {
    const currentCity = form.getValues("city");

    if (currentCity && !cityOptions.includes(currentCity)) {
      form.setValue("city", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [cityOptions, form, selectedCountry]);

  function onSubmit(values: ProfileFormValues) {
    updateProfile(values);
    setSaved(true);
  }

  return (
    <AppShell
      title="Editar perfil"
      subtitle="Mi perfil"
      chrome="plain"
      centerTopBarTitle
      topBarLeading={
        <Link href="/profile" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
          <ArrowLeft className="h-5 w-5 text-pawbit-text" />
        </Link>
      }
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-6">
        <form className="surface-card space-y-5 p-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <h2 className="text-[22px] font-semibold text-pawbit-text">Informacion personal</h2>
            <p className="text-sm text-pawbit-muted">Mantén al dia tus datos para comunicaciones y recordatorios.</p>
          </div>

          <FormField label="Nombre completo" required error={form.formState.errors.name?.message}>
            <Input placeholder="Tu nombre y apellido" {...form.register("name")} />
          </FormField>

          <FormField label="Correo electronico" required error={form.formState.errors.email?.message}>
            <Input type="email" placeholder="ejemplo@correo.com" {...form.register("email")} />
          </FormField>

          <FormField label="Telefono" required helper="Idealmente el numero donde recibes recordatorios." error={form.formState.errors.phone?.message}>
            <Input placeholder="+56 9 1234 5678" {...form.register("phone")} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Pais" required error={form.formState.errors.country?.message}>
              <SelectField {...form.register("country")}>
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </SelectField>
            </FormField>

            <FormField label="Ciudad / comuna" required error={form.formState.errors.city?.message}>
              <SelectField {...form.register("city")}>
                <option value="">Selecciona una ciudad</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </SelectField>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tipo de documento" required error={form.formState.errors.documentType?.message}>
              <SelectField {...form.register("documentType")}>
                <option value="RUT">RUT</option>
                <option value="DNI">DNI</option>
              </SelectField>
            </FormField>

            <FormField label="Numero de documento" required error={form.formState.errors.documentNumber?.message}>
              <Input placeholder="12.345.678-9" {...form.register("documentNumber")} />
            </FormField>
          </div>

          <PrimaryButton type="submit">Guardar cambios</PrimaryButton>
        </form>
      </div>
      <CompactConfirmationDialog
        open={saved}
        title="Tu perfil se actualizó correctamente"
        description="Tus datos ya quedaron guardados en la aplicación."
        onConfirm={() => setSaved(false)}
        onClose={() => setSaved(false)}
      />
    </AppShell>
  );
}

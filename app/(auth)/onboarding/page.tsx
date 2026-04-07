"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SelectField } from "@/components/forms/select-field";
import { authService } from "@/services/auth.service";
import { useAppStore } from "@/store/app-store";

const onboardingSchema = z.object({
  country: z.string().min(2, "Selecciona un país"),
  documentType: z.enum(["RUT", "DNI"]),
  documentNumber: z
    .string()
    .min(8, "Ingresa un documento válido")
    .regex(/^[0-9A-Za-z.\-]+$/, "Usa solo caracteres válidos")
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      country: "Chile",
      documentType: "RUT",
      documentNumber: ""
    },
    mode: "onChange"
  });

  async function onSubmit(values: OnboardingValues) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const user = await authService.completeOnboarding(values);
      completeOnboarding(user);
      router.push("/home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-12">
      <div className="space-y-10">
        <Logo />

        <section className="space-y-3">
          <h1 className="text-[34px] font-bold leading-[1.05] tracking-[-0.05em] text-pawbit-text">
            Antes de empezar, confirma tus datos.
          </h1>
          <p className="text-[16px] text-pawbit-muted">
            Esto nos ayuda a personalizar recordatorios y dejar la base lista para tus mascotas.
          </p>
        </section>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          {errorMessage ? (
            <div className="rounded-[22px] bg-pawbit-error-bg px-5 py-4 text-sm text-pawbit-text">
              {errorMessage}
            </div>
          ) : null}

          <FormField label="País" error={form.formState.errors.country?.message}>
            <SelectField {...form.register("country")}>
              <option value="Chile">Chile</option>
              <option value="Argentina">Argentina</option>
              <option value="Perú">Perú</option>
            </SelectField>
          </FormField>

          <FormField label="Tipo de documento" error={form.formState.errors.documentType?.message}>
            <SelectField {...form.register("documentType")}>
              <option value="RUT">RUT</option>
              <option value="DNI">DNI</option>
            </SelectField>
          </FormField>

          <FormField label="RUT / DNI" helper="Validación básica para primera configuración." error={form.formState.errors.documentNumber?.message}>
            <Input placeholder="18.245.331-6" {...form.register("documentNumber")} />
          </FormField>

          <PrimaryButton type="submit" disabled={!form.formState.isValid || submitting} className="gap-2">
            Continuar
            <ArrowRight className="h-5 w-5" />
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}

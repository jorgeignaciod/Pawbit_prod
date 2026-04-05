"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/forms/form-field";
import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useAppStore } from "@/store/app-store";

const emailSchema = z
  .object({
    currentEmail: z.string().email("Ingresa un correo valido"),
    newEmail: z.string().email("Ingresa un correo valido"),
    confirmEmail: z.string().email("Confirma tu nuevo correo")
  })
  .superRefine((values, ctx) => {
    if (values.newEmail === values.currentEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El nuevo correo debe ser distinto al actual",
        path: ["newEmail"]
      });
    }

    if (values.newEmail !== values.confirmEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los correos no coinciden",
        path: ["confirmEmail"]
      });
    }
  });

type EmailFormValues = z.infer<typeof emailSchema>;

export default function EditEmailPage() {
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [saved, setSaved] = useState(false);

  const defaultValues = useMemo<EmailFormValues>(
    () => ({
      currentEmail: user?.email ?? "",
      newEmail: "",
      confirmEmail: ""
    }),
    [user]
  );

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues
  });

  function onSubmit(values: EmailFormValues) {
    updateProfile({ email: values.newEmail });
    form.reset({
      currentEmail: values.newEmail,
      newEmail: "",
      confirmEmail: ""
    });
    setSaved(true);
  }

  return (
    <AppShell
      title="Editar correo"
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
        {saved ? (
          <div className="rounded-[22px] bg-pawbit-success-bg px-5 py-4 text-sm text-pawbit-text">
            Tu correo se actualizo correctamente.
          </div>
        ) : null}

        <form className="surface-card space-y-5 p-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <h2 className="text-[22px] font-semibold text-pawbit-text">Correo de acceso</h2>
            <p className="text-sm text-pawbit-muted">Usaremos este correo para ingresar y enviarte comunicaciones importantes.</p>
          </div>

          <FormField label="Correo actual" required error={form.formState.errors.currentEmail?.message}>
            <Input
              type="email"
              readOnly
              aria-readonly="true"
              className="cursor-default bg-pawbit-surface-alt text-pawbit-muted"
              {...form.register("currentEmail")}
            />
          </FormField>

          <FormField label="Nuevo correo" required error={form.formState.errors.newEmail?.message}>
            <Input type="email" placeholder="nuevo@correo.com" {...form.register("newEmail")} />
          </FormField>

          <FormField label="Confirmar nuevo correo" required error={form.formState.errors.confirmEmail?.message}>
            <Input type="email" placeholder="nuevo@correo.com" {...form.register("confirmEmail")} />
          </FormField>

          <PrimaryButton type="submit">Guardar correo</PrimaryButton>
        </form>
      </div>
    </AppShell>
  );
}

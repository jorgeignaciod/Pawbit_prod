"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/forms/form-field";
import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/primary-button";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Ingresa tu contraseña actual"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirma tu nueva contraseña")
  })
  .superRefine((values, ctx) => {
    if (values.currentPassword === values.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La nueva contraseña debe ser distinta a la actual",
        path: ["newPassword"]
      });
    }

    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
      });
    }
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function EditPasswordPage() {
  const [saved, setSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false
  });

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  function onSubmit() {
    form.reset();
    setSaved(true);
  }

  return (
    <AppShell
      title="Cambiar contraseña"
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
            Tu contraseña se actualizo correctamente.
          </div>
        ) : null}

        <form className="surface-card space-y-5 p-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <h2 className="text-[22px] font-semibold text-pawbit-text">Seguridad de la cuenta</h2>
            <p className="text-sm text-pawbit-muted">Elige una contraseña segura para proteger tu cuenta.</p>
          </div>

          <PasswordField
            label="Contraseña actual"
            visible={showPasswords.current}
            error={form.formState.errors.currentPassword?.message}
            onToggle={() => setShowPasswords((current) => ({ ...current, current: !current.current }))}
            registration={form.register("currentPassword")}
          />

          <PasswordField
            label="Nueva contraseña"
            visible={showPasswords.next}
            error={form.formState.errors.newPassword?.message}
            onToggle={() => setShowPasswords((current) => ({ ...current, next: !current.next }))}
            registration={form.register("newPassword")}
          />

          <PasswordField
            label="Confirmar nueva contraseña"
            visible={showPasswords.confirm}
            error={form.formState.errors.confirmPassword?.message}
            onToggle={() => setShowPasswords((current) => ({ ...current, confirm: !current.confirm }))}
            registration={form.register("confirmPassword")}
          />

          <PrimaryButton type="submit">Guardar contraseña</PrimaryButton>
        </form>
      </div>
    </AppShell>
  );
}

function PasswordField({
  label,
  visible,
  error,
  onToggle,
  registration
}: {
  label: string;
  visible: boolean;
  error?: string;
  onToggle: () => void;
  registration: ReturnType<typeof useForm<PasswordFormValues>>["register"] extends (...args: never[]) => infer R ? R : never;
}) {
  return (
    <FormField label={label} required error={error}>
      <div className="relative">
        <Input type={visible ? "text" : "password"} {...registration} />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-pawbit-hint"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </FormField>
  );
}

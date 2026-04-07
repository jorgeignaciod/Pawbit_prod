"use client";

import { useState } from "react";
import { Chrome, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthLogoBlock } from "@/components/auth/auth-logo-block";
import { AuthPrimaryAction } from "@/components/auth/auth-primary-action";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useAppStore } from "@/store/app-store";

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido"),
  password: z.string().min(1, "Ingresa tu contraseña")
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  });

  async function handleSubmit(values: SignInValues) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const user = await authService.login(values);
      login({ ...user, onboardingCompleted: true });
      router.push("/home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No pudimos iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleSignIn() {
    form.setValue("email", "jorge@pawbit.app", { shouldValidate: true });
    form.setValue("password", "Pawbit123", { shouldValidate: true });
    void handleSubmit({ email: "jorge@pawbit.app", password: "Pawbit123" });
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-10">
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center">
        <div className="w-full space-y-8">
          <AuthLogoBlock compact />

          <div className="space-y-4">
            <AuthPrimaryAction type="button" onClick={handleGoogleSignIn} disabled={submitting} className="gap-3">
              <Chrome className="h-4 w-4" />
              Ingresa con Google
            </AuthPrimaryAction>

            <AuthDivider label="O ingresa con tu Email" />

            {errorMessage ? (
              <div className="rounded-[20px] bg-pawbit-error-bg px-4 py-3 text-sm text-pawbit-text">{errorMessage}</div>
            ) : null}

            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField label="Email" required error={form.formState.errors.email?.message}>
                <Input type="email" placeholder="Ingresa tu email" {...form.register("email")} />
              </FormField>

              <FormField label="Contraseña" required error={form.formState.errors.password?.message}>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Ingresa tu contraseña" {...form.register("password")} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-pawbit-hint"
                    aria-label="Mostrar contraseña"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormField>

              <AuthPrimaryAction type="submit" disabled={!form.formState.isValid || submitting}>
                Iniciar sesión
              </AuthPrimaryAction>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

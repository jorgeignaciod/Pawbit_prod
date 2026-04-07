"use client";

import Link from "next/link";
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

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre"),
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Agrega al menos una mayúscula")
    .regex(/[a-z]/, "Agrega al menos una minúscula")
    .regex(/[0-9]/, "Agrega al menos un número"),
  acceptedTerms: z.boolean().refine((value) => value, {
    message: "Debes aceptar los términos y condiciones"
  })
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptedTerms: false
    },
    mode: "onChange"
  });

  async function handleSubmit(values: SignUpValues) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const user = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      login({ ...user, onboardingCompleted: true });
      router.push("/home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No pudimos crear tu cuenta.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const timestamp = Date.now();
      const user = await authService.register({
        name: "Usuario PawBit",
        email: `google.${timestamp}@pawbit.app`,
        password: "Pawbit123"
      });
      login({ ...user, onboardingCompleted: true });
      router.push("/home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No pudimos crear tu cuenta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-10">
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center">
        <div className="w-full space-y-8">
          <AuthLogoBlock compact />

          <div className="space-y-4">
            <AuthPrimaryAction type="button" onClick={handleGoogleSignUp} disabled={submitting} className="gap-3">
              <Chrome className="h-4 w-4" />
              Regístrate con Google
            </AuthPrimaryAction>

            <AuthDivider label="O continúa con tu Email" />

            {errorMessage ? (
              <div className="rounded-[20px] bg-pawbit-error-bg px-4 py-3 text-sm text-pawbit-text">{errorMessage}</div>
            ) : null}

            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField label="Nombre" required error={form.formState.errors.name?.message}>
                <Input placeholder="Ingresa tu nombre" {...form.register("name")} />
              </FormField>

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

              <label className="flex items-start gap-3 rounded-[20px] border border-pawbit-stroke bg-white px-4 py-3">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-black" {...form.register("acceptedTerms")} />
                <span className="text-sm leading-5 text-pawbit-text">
                  Acepto los Términos de Servicio y la Política de Privacidad.
                </span>
              </label>
              {form.formState.errors.acceptedTerms ? (
                <p className="text-xs text-pawbit-error">{form.formState.errors.acceptedTerms.message}</p>
              ) : null}

              <AuthPrimaryAction type="submit" disabled={!form.formState.isValid || submitting}>
                Crear cuenta
              </AuthPrimaryAction>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-[15px] text-pawbit-text">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login/sign-in" className="font-semibold text-pawbit-primary">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { AuthSocialButton } from "@/components/forms/auth-social-button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { PrimaryButton } from "@/components/ui/primary-button";
import { authService } from "@/services/auth.service";
import { useAppStore } from "@/store/app-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(provider?: "google" | "apple") {
    const user = provider ? await authService.loginWithProvider(provider) : await authService.getCurrentUser();
    login(user);
    router.push("/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col justify-between px-6 pb-8 pt-16">
      <div className="space-y-10">
        <Logo className="flex-col justify-center text-center" />

        <section className="space-y-6">
          <AuthSocialButton provider="google" onClick={() => handleLogin("google")} />

          <div className="flex items-center gap-4 text-pawbit-muted">
            <div className="h-px flex-1 bg-pawbit-stroke" />
            <span className="text-sm">o</span>
            <div className="h-px flex-1 bg-pawbit-stroke" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-pawbit-text">Correo</label>
              <Input placeholder="ejemplo@correo.com" />
            </div>

            <div className="space-y-2">
              <label className="text-[16px] font-semibold text-pawbit-text">Contraseña</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} defaultValue="12345678" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-pawbit-hint"
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="text-right text-[15px] font-medium text-pawbit-primary">¿Olvidaste tu contraseña?</div>
          <PrimaryButton onClick={() => handleLogin()}>Iniciar sesión</PrimaryButton>
          <button type="button" onClick={() => handleLogin("apple")} className="w-full text-center text-[15px] text-pawbit-muted">
            ¿No tienes cuenta? <span className="font-medium text-pawbit-primary">Crear cuenta</span>
          </button>
        </section>
      </div>

      <div className="space-y-2 text-center text-sm text-pawbit-hint">
        <p>PawBit MVP opera con datos mock para validar el flujo.</p>
        <p>Términos · Privacidad</p>
      </div>
    </div>
  );
}

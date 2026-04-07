"use client";

import Link from "next/link";

import { AuthLogoBlock } from "@/components/auth/auth-logo-block";

export default function LoginLandingPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-10">
      <div className="flex flex-1 flex-col items-center justify-center pb-16">
        <AuthLogoBlock />
      </div>

      <div className="space-y-4">
        <Link
          href="/login/sign-in"
          className="flex h-[52px] w-full items-center justify-center rounded-pill bg-black px-6 text-[16px] font-semibold text-white shadow-soft transition hover:opacity-95"
        >
          Iniciar sesión
        </Link>

        <p className="text-center text-[15px] text-pawbit-text">
          ¿Aún no tienes una cuenta?{" "}
          <Link href="/login/sign-up" className="font-semibold text-pawbit-primary">
            Crea tu cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}

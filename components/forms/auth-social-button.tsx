"use client";

import { ButtonHTMLAttributes } from "react";
import { Apple, Chrome } from "lucide-react";

import { SecondaryButton } from "@/components/ui/secondary-button";

export function AuthSocialButton({
  provider,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { provider: "google" | "apple" }) {
  const Icon = provider === "google" ? Chrome : Apple;
  const label = provider === "google" ? "Continuar con Google" : "Continuar con Apple";

  return (
    <SecondaryButton className="justify-center gap-3 text-pawbit-text" {...props}>
      <Icon className="h-4 w-4" />
      {label}
    </SecondaryButton>
  );
}

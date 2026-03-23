"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function PrimaryButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-[58px] w-full items-center justify-center rounded-pill bg-pawbit-primary px-6 text-[17px] font-semibold text-pawbit-primary-foreground shadow-coral transition hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

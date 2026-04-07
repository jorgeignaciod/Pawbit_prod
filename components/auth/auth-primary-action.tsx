"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function AuthPrimaryAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex h-[52px] w-full items-center justify-center rounded-pill bg-black px-6 text-[16px] font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

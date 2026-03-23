"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SecondaryButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-[56px] w-full items-center justify-center rounded-pill border border-pawbit-stroke bg-white px-5 text-base font-semibold text-pawbit-text shadow-soft transition hover:bg-pawbit-surface-alt disabled:cursor-not-allowed disabled:text-pawbit-disabled",
        className
      )}
      {...props}
    />
  );
}

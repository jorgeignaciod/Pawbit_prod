"use client";

import { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SelectField({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-[58px] w-full rounded-[20px] border border-pawbit-stroke bg-pawbit-input-alt px-5 text-[16px] text-pawbit-text outline-none transition focus:border-pawbit-primary focus:bg-white",
        className
      )}
      {...props}
    />
  );
}

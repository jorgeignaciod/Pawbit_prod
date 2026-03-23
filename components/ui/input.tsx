"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-[58px] w-full rounded-[20px] border border-pawbit-stroke bg-pawbit-input-alt px-5 text-[16px] text-pawbit-text outline-none transition placeholder:text-pawbit-hint focus:border-pawbit-primary focus:bg-white",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };

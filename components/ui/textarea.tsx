"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[136px] w-full rounded-[28px] border border-pawbit-stroke bg-pawbit-input-alt px-5 py-4 text-[16px] text-pawbit-text outline-none transition placeholder:text-pawbit-hint focus:border-pawbit-primary focus:bg-white",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export { Textarea };

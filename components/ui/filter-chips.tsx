"use client";

import { cn } from "@/lib/utils";

export interface FilterChipOption {
  label: string;
  value: string;
}

export function FilterChips({
  options,
  value,
  onChange
}: {
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-pill border px-4 py-2.5 text-sm font-medium transition whitespace-nowrap",
              active
                ? "border-pawbit-error-border bg-pawbit-error-bg text-pawbit-primary"
                : "border-pawbit-stroke bg-white text-pawbit-chip-default-text"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

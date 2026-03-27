"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchableComboboxProps {
  value: string;
  options: string[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (value: string) => void;
}

export function SearchableCombobox({
  value,
  options,
  placeholder,
  searchPlaceholder = "Buscar...",
  emptyLabel = "No encontramos resultados.",
  disabled = false,
  loading = false,
  onChange
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return options.slice(0, 40);
    }

    return options
      .filter((option) => option.toLowerCase().includes(normalizedQuery))
      .slice(0, 40);
  }, [deferredQuery, options]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-[58px] w-full items-center justify-between rounded-[20px] border border-pawbit-stroke bg-pawbit-input-alt px-5 text-left text-[16px] text-pawbit-text outline-none transition",
          "focus:border-pawbit-primary focus:bg-white",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className={cn(!value && "text-pawbit-hint")}>{value || placeholder}</span>
        <ChevronDown className={cn("h-5 w-5 text-pawbit-hint transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-[24px] border border-pawbit-stroke bg-white p-3 shadow-soft">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pawbit-hint" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-12 w-full rounded-[18px] border border-pawbit-stroke bg-pawbit-input-alt pl-11 pr-4 text-[15px] text-pawbit-text outline-none transition placeholder:text-pawbit-hint focus:border-pawbit-primary focus:bg-white"
            />
          </div>

          <div className="mt-3 max-h-64 overflow-y-auto">
            {loading ? <ComboboxHint label="Cargando razas..." /> : null}

            {!loading && filteredOptions.length === 0 ? <ComboboxHint label={emptyLabel} /> : null}

            {!loading
              ? filteredOptions.map((option) => {
                  const selected = option === value;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-[15px] text-pawbit-text transition hover:bg-pawbit-input-alt",
                        selected && "bg-pawbit-error-bg/50"
                      )}
                    >
                      <span>{option}</span>
                      {selected ? <Check className="h-4 w-4 text-pawbit-primary" /> : null}
                    </button>
                  );
                })
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ComboboxHint({ label }: { label: string }) {
  return <p className="px-4 py-3 text-[14px] text-pawbit-muted">{label}</p>;
}

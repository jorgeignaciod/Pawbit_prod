"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";

import { PrimaryButton } from "@/components/ui/primary-button";

type CompactConfirmationDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose?: () => void;
};

export function CompactConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Continuar",
  onConfirm,
  onClose
}: CompactConfirmationDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        (onClose ?? onConfirm)();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onConfirm, open]);

  if (!open) {
    return null;
  }

  const handleDismiss = onClose ?? onConfirm;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#5f6472]/20 px-6 backdrop-blur-[2px]"
      onClick={handleDismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[320px] rounded-[28px] bg-white px-5 pb-5 pt-4 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-pawbit-input-alt text-pawbit-hint"
            aria-label="Cerrar confirmación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-success-bg text-pawbit-success">
            <Check className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-[22px] font-semibold leading-tight tracking-[-0.03em] text-pawbit-text">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-6 text-pawbit-muted">{description}</p> : null}
        </div>

        <div className="mt-5">
          <PrimaryButton type="button" onClick={onConfirm}>
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

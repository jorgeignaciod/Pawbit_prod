import { LoaderCircle, TriangleAlert } from "lucide-react";

import { PrimaryButton } from "@/components/ui/primary-button";

export function LoadingCard({ label = "Cargando contenido..." }: { label?: string }) {
  return (
    <div className="surface-card flex items-center gap-3 p-5 text-pawbit-muted">
      <LoaderCircle className="h-5 w-5 animate-spin text-pawbit-primary" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorCard({
  title,
  description,
  actionLabel = "Reintentar",
  onRetry
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex items-center gap-3 text-pawbit-primary">
        <TriangleAlert className="h-5 w-5" />
        <h2 className="text-base">{title}</h2>
      </div>
      <p className="text-sm text-pawbit-muted">{description}</p>
      {onRetry ? <PrimaryButton onClick={onRetry}>{actionLabel}</PrimaryButton> : null}
    </div>
  );
}

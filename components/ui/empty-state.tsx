import { CircleAlert } from "lucide-react";

import { SecondaryButton } from "@/components/ui/secondary-button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-4 p-6 text-center">
      <div className="rounded-full bg-pawbit-surface-alt p-3 text-pawbit-muted">
        <CircleAlert className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg">{title}</h2>
        <p className="text-sm text-pawbit-muted">{description}</p>
      </div>
      {actionLabel && onAction ? <SecondaryButton onClick={onAction}>{actionLabel}</SecondaryButton> : null}
    </div>
  );
}

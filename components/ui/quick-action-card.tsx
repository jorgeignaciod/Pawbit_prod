import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function QuickActionCard({
  href,
  title,
  description,
  icon: Icon
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="surface-card flex min-h-[124px] flex-col justify-between p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-chip-active text-pawbit-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-[16px] font-semibold text-pawbit-text">{title}</p>
        {description ? <p className="text-sm text-pawbit-muted">{description}</p> : null}
      </div>
    </Link>
  );
}

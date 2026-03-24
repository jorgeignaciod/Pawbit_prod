import { Bell } from "lucide-react";

import { Logo } from "@/components/ui/logo";

export function TopBar({
  title,
  subtitle,
  showLogo = false,
  action,
  plain = false,
  hideTitle = false
}: {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  action?: React.ReactNode;
  plain?: boolean;
  hideTitle?: boolean;
}) {
  return (
    <header className={plain ? "pt-3" : "sticky top-0 z-20 bg-pawbit-background/96 backdrop-blur"}>
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-6">
        {showLogo ? (
          <Logo compact />
        ) : hideTitle ? (
          <div />
        ) : (
          <div>
            <p className="text-[18px] font-semibold text-pawbit-text">{title}</p>
            {subtitle && !plain ? <p className="text-xs text-pawbit-muted">{subtitle}</p> : null}
          </div>
        )}
        {action ?? (
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}

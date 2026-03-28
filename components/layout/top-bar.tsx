import { Bell } from "lucide-react";

import { Logo } from "@/components/ui/logo";

export function TopBar({
  title,
  subtitle,
  showLogo = false,
  action,
  leadingAction,
  plain = false,
  hideTitle = false,
  centerTitle = false
}: {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  action?: React.ReactNode;
  leadingAction?: React.ReactNode;
  plain?: boolean;
  hideTitle?: boolean;
  centerTitle?: boolean;
}) {
  const leftSlot = leadingAction ? (
    leadingAction
  ) : showLogo ? (
    <Logo compact />
  ) : hideTitle || centerTitle ? (
    <div className="h-12 w-12" />
  ) : (
    <div>
      <p className="text-[18px] font-semibold text-pawbit-text">{title}</p>
      {subtitle && !plain ? <p className="text-xs text-pawbit-muted">{subtitle}</p> : null}
    </div>
  );

  const rightSlot =
    action ?? (
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
      </button>
    );

  return (
    <header className={plain ? "pt-3" : "sticky top-0 z-20 bg-pawbit-background/96 backdrop-blur"}>
      <div className="mx-auto grid h-14 max-w-md grid-cols-[auto_1fr_auto] items-center gap-4 px-6">
        <div className="flex items-center justify-start">{leftSlot}</div>
        {centerTitle ? (
          <div className="text-center">
            <p className="text-[20px] font-semibold text-pawbit-text">{title}</p>
          </div>
        ) : hideTitle ? (
          <div />
        ) : (
          <div>
            <p className="text-[18px] font-semibold text-pawbit-text">{title}</p>
            {subtitle && !plain ? <p className="text-xs text-pawbit-muted">{subtitle}</p> : null}
          </div>
        )}
        <div className="flex items-center justify-end">{rightSlot}</div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { BellRing, CalendarClock, HeartPulse, Pill, Syringe } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { NotificationItem as NotificationItemType } from "@/types/notification";
import { cn } from "@/lib/utils";

const iconMap = {
  Vacuna: Syringe,
  Control: CalendarClock,
  Recordatorio: BellRing,
  Medicamento: Pill,
  Sistema: HeartPulse
} as const;

const toneMap = {
  Vacuna: "bg-pawbit-blue-bg text-pawbit-blue",
  Control: "bg-[#fff1df] text-[#de8b14]",
  Recordatorio: "bg-pawbit-error-bg text-pawbit-primary",
  Medicamento: "bg-pawbit-success-bg text-pawbit-success",
  Sistema: "bg-pawbit-chip-default text-pawbit-muted"
} as const;

export function NotificationItem({ notification }: { notification: NotificationItemType }) {
  const Icon = iconMap[notification.type];

  return (
    <Link
      href={notification.actionHref}
      className={cn(
        "surface-card flex items-start gap-4 p-5 transition",
        !notification.read && "border-pawbit-error-border/50 bg-white"
      )}
    >
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", toneMap[notification.type])}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold text-pawbit-text">{notification.title}</p>
            <p className="mt-1 text-[14px] text-pawbit-muted">{notification.body}</p>
          </div>
          {!notification.read ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-pawbit-primary" /> : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-pawbit-muted">
            {notification.eventDate
              ? format(parseISO(notification.eventDate), "EEEE d MMM, HH:mm", { locale: es })
              : format(parseISO(notification.createdAt), "d MMM, HH:mm", { locale: es })}
          </span>
          <span className="rounded-pill bg-pawbit-input-alt px-3 py-1 text-[12px] font-medium text-pawbit-muted">
            {notification.type}
          </span>
        </div>
      </div>
    </Link>
  );
}

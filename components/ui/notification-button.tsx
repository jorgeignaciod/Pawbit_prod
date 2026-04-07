"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <Link
      href="/notifications"
      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft"
      aria-label="Notificaciones"
    >
      <Bell className="h-6 w-6" />
    </Link>
  );
}

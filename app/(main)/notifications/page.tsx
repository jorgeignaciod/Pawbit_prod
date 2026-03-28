"use client";

import { useEffect, useMemo, useState } from "react";
import { isToday, isTomorrow, parseISO } from "date-fns";

import { AppShell } from "@/components/layout/app-shell";
import { NotificationButton } from "@/components/ui/notification-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorCard, LoadingCard } from "@/components/feedback/state-card";
import { NotificationSection } from "@/components/notifications/notification-section";
import { notificationsService } from "@/services/notifications.service";
import { NotificationItem } from "@/types/notification";

function priorityScore(priority: NotificationItem["priority"]) {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    notificationsService
      .getNotifications()
      .then((items) => {
        setNotifications(items);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const visibleNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => {
        const aDate = a.eventDate ?? a.createdAt;
        const bDate = b.eventDate ?? b.createdAt;
        const byPriority = priorityScore(b.priority) - priorityScore(a.priority);
        if (byPriority !== 0) return byPriority;
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      })
      .slice(0, 10);
  }, [notifications]);

  const grouped = useMemo(() => {
    const todayItems: NotificationItem[] = [];
    const upcomingItems: NotificationItem[] = [];
    const recentItems: NotificationItem[] = [];

    for (const item of visibleNotifications) {
      const date = parseISO(item.eventDate ?? item.createdAt);
      if (isToday(date) || isTomorrow(date)) {
        todayItems.push(item);
      } else if (date > new Date()) {
        upcomingItems.push(item);
      } else {
        recentItems.push(item);
      }
    }

    return { todayItems, upcomingItems, recentItems: recentItems.slice(0, 5) };
  }, [visibleNotifications]);

  const unreadCount = visibleNotifications.filter((item) => !item.read).length;

  return (
    <AppShell
      title="Notificaciones"
      subtitle="Notificaciones"
      chrome="plain"
      hideTopBarTitle
      topBarLeading={<h1 className="text-[28px] font-semibold tracking-[-0.03em] text-pawbit-text">Notificaciones</h1>}
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-5">
        {status === "loading" ? <LoadingCard label="Cargando notificaciones..." /> : null}
        {status === "error" ? <ErrorCard title="No pudimos cargar las notificaciones" description="Intenta nuevamente en unos segundos." onRetry={() => window.location.reload()} /> : null}

        {status === "success" ? (
          visibleNotifications.length ? (
            <>
              <div className="surface-card p-5">
                <p className="text-[16px] font-semibold text-pawbit-text">
                  {unreadCount ? `Tienes ${unreadCount} notificación${unreadCount === 1 ? "" : "es"} pendiente${unreadCount === 1 ? "" : "s"}` : "Todo está al día"}
                </p>
              </div>

              <NotificationSection title="Hoy" items={grouped.todayItems} />
              <NotificationSection title="Próximamente" items={grouped.upcomingItems} />
              <NotificationSection title="Recientes" items={grouped.recentItems} />
            </>
          ) : (
            <EmptyState
              title="No tienes notificaciones"
              description="Cuando haya vacunas, controles o recordatorios aparecerán aquí."
              actionLabel="Ir al calendario"
              onAction={() => {
                window.location.href = "/calendar";
              }}
            />
          )
        ) : null}
      </div>
    </AppShell>
  );
}

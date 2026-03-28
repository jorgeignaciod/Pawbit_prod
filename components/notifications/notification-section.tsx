import { NotificationItem as NotificationItemType } from "@/types/notification";
import { NotificationItem } from "@/components/notifications/notification-item";

export function NotificationSection({
  title,
  items
}: {
  title: string;
  items: NotificationItemType[];
}) {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <p className="section-kicker">{title}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <NotificationItem key={item.id} notification={item} />
        ))}
      </div>
    </section>
  );
}

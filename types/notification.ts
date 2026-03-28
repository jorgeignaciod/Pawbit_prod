export type NotificationType = "Vacuna" | "Control" | "Recordatorio" | "Medicamento" | "Sistema";
export type NotificationPriority = "high" | "medium" | "low";

export interface NotificationItem {
  id: string;
  petId?: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  eventDate?: string;
  read: boolean;
  resolved: boolean;
  priority: NotificationPriority;
  actionHref: string;
}

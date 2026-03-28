import { addDays, addHours, subDays } from "date-fns";

import { NotificationItem } from "@/types/notification";

const now = new Date();

export const notificationsMock: NotificationItem[] = [
  {
    id: "notif-1",
    petId: "pet-1",
    type: "Vacuna",
    title: "Vacuna séxtuple de Mora",
    body: "Programada para mañana a las 10:00.",
    createdAt: addHours(now, -2).toISOString(),
    eventDate: addDays(now, 1).toISOString(),
    read: false,
    resolved: false,
    priority: "high",
    actionHref: "/calendar"
  },
  {
    id: "notif-2",
    petId: "pet-2",
    type: "Control",
    title: "Control urinario de Simba",
    body: "Hoy a las 14:00 en Clínica Central.",
    createdAt: addHours(now, -5).toISOString(),
    eventDate: now.toISOString(),
    read: false,
    resolved: false,
    priority: "high",
    actionHref: "/calendar/week"
  },
  {
    id: "notif-3",
    petId: "pet-1",
    type: "Recordatorio",
    title: "Comprar antiparasitario",
    body: "Recordatorio para Mora hoy a las 18:00.",
    createdAt: addHours(now, -1).toISOString(),
    eventDate: now.toISOString(),
    read: false,
    resolved: false,
    priority: "medium",
    actionHref: "/pets/pet-1"
  },
  {
    id: "notif-4",
    petId: "pet-2",
    type: "Medicamento",
    title: "Última dosis de suplemento",
    body: "Simba termina el tratamiento mañana.",
    createdAt: addHours(now, -8).toISOString(),
    eventDate: addDays(now, 1).toISOString(),
    read: true,
    resolved: false,
    priority: "medium",
    actionHref: "/register/medication"
  },
  {
    id: "notif-5",
    petId: "pet-1",
    type: "Control",
    title: "Chequeo dermatológico de Mora",
    body: "Próxima semana a las 11:30.",
    createdAt: subDays(now, 1).toISOString(),
    eventDate: addDays(now, 8).toISOString(),
    read: true,
    resolved: false,
    priority: "medium",
    actionHref: "/calendar/week"
  },
  {
    id: "notif-6",
    type: "Sistema",
    title: "Recordatorios sincronizados",
    body: "Tus recordatorios quedaron actualizados correctamente.",
    createdAt: subDays(now, 2).toISOString(),
    read: true,
    resolved: true,
    priority: "low",
    actionHref: "/profile"
  },
  {
    id: "notif-7",
    petId: "pet-2",
    type: "Vacuna",
    title: "Vacuna triple felina de Simba",
    body: "En dos semanas a las 16:00.",
    createdAt: subDays(now, 1).toISOString(),
    eventDate: addDays(now, 16).toISOString(),
    read: false,
    resolved: false,
    priority: "medium",
    actionHref: "/pets/pet-2/health"
  }
];

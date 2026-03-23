import { CalendarDays, HeartPulse, House, PawPrint, UserRound } from "lucide-react";

export const bottomNavigationItems = [
  { href: "/home", label: "Inicio", icon: House },
  { href: "/pets", label: "Mascotas", icon: PawPrint },
  { href: "/register", label: "Registrar", icon: HeartPulse },
  { href: "/calendar/week", label: "Calendario", icon: CalendarDays },
  { href: "/profile", label: "Mi Perfil", icon: UserRound }
] as const;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BellRing, ChevronRight, CircleHelp, Lock, Mail, Pencil, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { useAppStore } from "@/store/app-store";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const [notifications, setNotifications] = useState({
    vaccines: true,
    medication: true,
    reminders: false
  });

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  return (
    <AppShell
      title="Mi perfil"
      subtitle="Mi Perfil"
      chrome="plain"
      hideTopBarTitle
      topBarLeading={<h1 className="text-[28px] font-semibold tracking-[-0.03em] text-pawbit-text">Mi perfil</h1>}
      topBarAction={<div className="h-12 w-12" />}
    >
      <div className="space-y-8">
        <section className="space-y-4 pt-2 text-center">
          <div className="relative mx-auto h-28 w-28">
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.name} width={112} height={112} className="h-28 w-28 rounded-full border-[6px] border-white object-cover shadow-soft" />
            ) : null}
            <button type="button" className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-pawbit-primary text-white shadow-coral">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h1 className="text-[28px] font-semibold text-pawbit-text">{user?.name ?? "Jorge Díaz"}</h1>
            <p className="text-[16px] text-pawbit-muted">{user?.email ?? "jorge.diaz@email.com"}</p>
          </div>
        </section>

        <section className="space-y-4">
          <p className="section-kicker">Cuenta</p>
          <div className="surface-card overflow-hidden p-0">
            <ProfileRow icon={UserRound} label="Editar perfil" href="/profile/edit" />
            <ProfileRow icon={Mail} label="Correo" href="/profile/email" />
            <ProfileRow icon={Lock} label="Cambiar contraseña" href="/profile/password" />
          </div>
        </section>

        <section className="space-y-4">
          <p className="section-kicker">Notificaciones</p>
          <div className="surface-card overflow-hidden p-0">
            <ToggleRow icon={BellRing} label="Vacunas" enabled={notifications.vaccines} onToggle={() => toggleNotification("vaccines")} />
            <ToggleRow icon={CircleHelp} label="Medicación" enabled={notifications.medication} onToggle={() => toggleNotification("medication")} />
            <ToggleRow icon={BellRing} label="Recordatorios" enabled={notifications.reminders} onToggle={() => toggleNotification("reminders")} />
          </div>
        </section>

        <button onClick={handleLogout} className="w-full text-center text-[15px] font-medium text-pawbit-primary">
          Cerrar sesión
        </button>
      </div>
    </AppShell>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  href
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-pawbit-primary" />
        <span className="text-[16px] font-medium text-pawbit-text">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-pawbit-hint" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center justify-between border-b border-pawbit-stroke px-5 py-5 last:border-none">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center justify-between border-b border-pawbit-stroke px-5 py-5 last:border-none">{content}</div>;
}

function ToggleRow({
  icon: Icon,
  label,
  enabled = false,
  onToggle
}: {
  icon: typeof BellRing;
  label: string;
  enabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-pawbit-stroke px-5 py-5 last:border-none">
      <div className="flex items-center gap-4">
        <Icon className={`h-5 w-5 transition-colors ${enabled ? "text-pawbit-primary" : "text-pawbit-disabled"}`} />
        <span className="text-[16px] font-medium text-pawbit-text">{label}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={`${enabled ? "Desactivar" : "Activar"} notificaciones de ${label.toLowerCase()}`}
        className={`flex h-9 w-16 items-center rounded-pill p-1 transition-colors ${enabled ? "bg-pawbit-primary" : "bg-[#d9e1ef]"}`}
      >
        <div className={`h-7 w-7 rounded-full bg-white shadow-soft transition-all ${enabled ? "ml-auto" : ""}`} />
      </button>
    </div>
  );
}

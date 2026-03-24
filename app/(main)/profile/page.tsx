"use client";

import Image from "next/image";
import { BellRing, ChevronRight, CircleHelp, Lock, Mail, Pencil, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { useAppStore } from "@/store/app-store";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <AppShell
      title="Mi Perfil"
      subtitle="Mi Perfil"
      chrome="plain"
      hideTopBarTitle
      topBarAction={
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary shadow-soft">
          <Settings className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-8">
        <section className="space-y-4 pt-6 text-center">
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
            <ProfileRow icon={UserRound} label="Editar perfil" />
            <ProfileRow icon={Mail} label="Correo" />
            <ProfileRow icon={Lock} label="Cambiar contraseña" />
          </div>
        </section>

        <section className="space-y-4">
          <p className="section-kicker">Notificaciones</p>
          <div className="surface-card overflow-hidden p-0">
            <ToggleRow icon={BellRing} label="Vacunas" enabled />
            <ToggleRow icon={CircleHelp} label="Medicación" enabled />
            <ToggleRow icon={BellRing} label="Recordatorios" />
          </div>
        </section>

        <button onClick={handleLogout} className="w-full text-center text-[15px] font-medium text-pawbit-primary">
          Cerrar sesión
        </button>
      </div>
    </AppShell>
  );
}

function ProfileRow({ icon: Icon, label }: { icon: typeof Mail; label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-pawbit-stroke px-5 py-5 last:border-none">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-pawbit-primary" />
        <span className="text-[16px] font-medium text-pawbit-text">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-pawbit-hint" />
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  enabled = false
}: {
  icon: typeof BellRing;
  label: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-pawbit-stroke px-5 py-5 last:border-none">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-pawbit-primary" />
        <span className="text-[16px] font-medium text-pawbit-text">{label}</span>
      </div>
      <div className={`flex h-9 w-16 items-center rounded-pill p-1 ${enabled ? "bg-pawbit-primary" : "bg-[#d9e1ef]"}`}>
        <div className={`h-7 w-7 rounded-full bg-white shadow-soft transition ${enabled ? "ml-auto" : ""}`} />
      </div>
    </div>
  );
}

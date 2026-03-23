import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronDown } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { petsMock } from "@/mocks/pets.mock";

const activePet = petsMock[0];

export default function RegisterPage() {
  return (
    <AppShell title="Registrar" subtitle="Registrar" chrome="plain">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
            <ArrowLeft className="h-5 w-5 text-pawbit-text" />
          </Link>
          <div className="flex-1 text-center text-[20px] font-semibold text-pawbit-text">Registrar</div>
          <div className="w-12" />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          <button className="rounded-pill bg-pawbit-primary px-6 py-3 text-[16px] font-semibold text-white shadow-coral">Peso</button>
          <Link href="/register/vaccine" className="rounded-pill bg-pawbit-error-bg px-6 py-3 text-[16px] font-medium text-pawbit-primary">Vacuna</Link>
          <button className="rounded-pill bg-pawbit-error-bg px-6 py-3 text-[16px] font-medium text-pawbit-primary">Medicación</button>
          <button className="rounded-pill bg-pawbit-error-bg px-6 py-3 text-[16px] font-medium text-pawbit-primary">Nota</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-[16px] font-semibold text-pawbit-text">Mascota</p>
            <button className="surface-card flex w-full items-center gap-4 p-4">
              <Image src={activePet.avatar} alt={activePet.name} width={48} height={48} className="rounded-full object-cover" />
              <span className="flex-1 text-left text-[18px] font-semibold text-pawbit-text">{activePet.name}</span>
              <ChevronDown className="h-5 w-5 text-pawbit-primary" />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-[16px] font-semibold text-pawbit-text">Fecha y hora</p>
            <button className="surface-card flex w-full items-center gap-4 p-4">
              <span className="flex-1 text-left text-[18px] text-pawbit-text">Ahora</span>
              <CalendarDays className="h-5 w-5 text-pawbit-primary" />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-[16px] font-semibold text-pawbit-text">Peso (kg)</p>
            <div className="relative">
              <Input defaultValue="0.0" className="pr-14" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-pawbit-hint">kg</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[16px] font-semibold text-pawbit-text">Nota <span className="font-normal text-pawbit-hint">(Opcional)</span></p>
            <textarea
              className="min-h-[140px] w-full rounded-[32px] border border-pawbit-stroke bg-white px-5 py-4 text-[16px] text-pawbit-text outline-none"
              placeholder="Añade algún detalle..."
            />
          </div>
        </div>

        <button className="w-full rounded-pill bg-pawbit-primary px-6 py-4 text-[17px] font-semibold text-white shadow-coral">
          Guardar registro
        </button>
      </div>
    </AppShell>
  );
}

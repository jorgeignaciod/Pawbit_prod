import Link from "next/link";
import { ChevronRight, ClipboardList, Scale, ShieldCheck } from "lucide-react";

import { AvatarPet } from "@/components/pets/pet-avatar";
import { Pet } from "@/types/pet";

export function PetSummaryCard({ pet }: { pet: Pet }) {
  const summaryItems = [
    {
      label: "Vacunas",
      value: "Pendiente",
      icon: ShieldCheck,
      iconClassName: "text-[#20b887]"
    },
    {
      label: "Peso",
      value: pet.weight > 0 ? `${pet.weight} kg` : "Pendiente",
      icon: Scale,
      iconClassName: "text-pawbit-primary"
    },
    {
      label: "Último registro",
      value: "Pendiente",
      icon: ClipboardList,
      iconClassName: "text-[#91a0bb]"
    }
  ];

  return (
    <Link href={`/pets/${pet.id}`} className="surface-card block bg-pawbit-surface p-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AvatarPet name={pet.name} src={pet.avatar} size={52} />
            <div>
              <p className="text-[20px] font-semibold text-pawbit-text">{pet.name}</p>
              <p className="text-sm text-pawbit-muted">{pet.breed}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-pawbit-hint" />
        </div>

        <div className="space-y-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-center gap-4">
                <Icon className={`h-8 w-8 ${item.iconClassName}`} strokeWidth={2.2} />
                <p className="text-[18px] text-pawbit-text">
                  {item.label}: <span className="font-medium">{item.value}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
}

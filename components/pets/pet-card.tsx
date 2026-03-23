import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AvatarPet } from "@/components/pets/pet-avatar";
import { formatAgeLabel } from "@/lib/utils";
import { Pet } from "@/types/pet";

export function PetCard({ pet }: { pet: Pet }) {
  const chips =
    pet.id === "pet-1"
      ? [
          { label: "Vacunas al día", className: "bg-pawbit-success-bg text-pawbit-success" },
          { label: "Peso ok", className: "bg-pawbit-blue-bg text-pawbit-blue" }
        ]
      : [{ label: "1 pendiente", className: "bg-pawbit-error-bg text-pawbit-primary" }];

  return (
    <Link href={`/pets/${pet.id}`} className="surface-card flex items-center gap-4 p-5">
      <AvatarPet name={pet.name} src={pet.avatar} size={56} />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="truncate text-[20px] leading-6 text-pawbit-text">{pet.name}</h2>
            <p className="text-[15px] text-pawbit-muted">{pet.breed}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-pawbit-hint" />
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip.label} className={`rounded-pill px-3 py-1 text-sm font-medium ${chip.className}`}>
              {chip.label}
            </span>
          ))}
          <span className="rounded-pill bg-pawbit-chip-default px-3 py-1 text-sm font-medium text-pawbit-chip-default-text">
            {formatAgeLabel(pet.birthDate)} · {pet.weight} kg
          </span>
        </div>
      </div>
    </Link>
  );
}

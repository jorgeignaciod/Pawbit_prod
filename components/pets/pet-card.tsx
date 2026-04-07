import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AvatarPet } from "@/components/pets/pet-avatar";
import { formatAgeLabel } from "@/lib/utils";
import { Pet } from "@/types/pet";

export function PetCard({ pet }: { pet: Pet }) {
  const meta = [
    pet.species,
    pet.birthDate ? formatAgeLabel(pet.birthDate) : null,
    pet.weight > 0 ? `${pet.weight} kg` : null
  ].filter(Boolean);

  return (
    <Link href={`/pets/${pet.id}`} className="surface-card flex items-center gap-4 p-5">
      <AvatarPet name={pet.name} src={pet.avatar} size={56} />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="truncate text-[20px] leading-6 text-pawbit-text">{pet.name}</h2>
            <p className="text-[15px] text-pawbit-muted">{pet.breed || "Sin raza especificada"}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-pawbit-hint" />
        </div>
        {meta.length ? (
          <div className="flex flex-wrap gap-2">
            {meta.map((label) => (
              <span key={label} className="rounded-pill bg-pawbit-chip-default px-3 py-1 text-sm font-medium text-pawbit-chip-default-text">
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

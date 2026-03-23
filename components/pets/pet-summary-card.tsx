import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AvatarPet } from "@/components/pets/pet-avatar";
import { Pet } from "@/types/pet";

export function PetSummaryCard({ pet }: { pet: Pet }) {
  return (
    <Link href={`/pets/${pet.id}`} className="surface-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AvatarPet name={pet.name} src={pet.avatar} size={52} />
          <div>
            <p className="text-[18px] font-semibold text-pawbit-text">{pet.name}</p>
            <p className="text-sm text-pawbit-muted">{pet.breed}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-pawbit-hint" />
      </div>
    </Link>
  );
}

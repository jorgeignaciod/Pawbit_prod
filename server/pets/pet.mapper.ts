import { Pet as PrismaPet, PetSex as PrismaPetSex, PetSpecies as PrismaPetSpecies } from "@prisma/client";

import { Pet } from "@/types/pet";

function mapSpecies(species: PrismaPetSpecies): Pet["species"] {
  return species === "PERRO" ? "Perro" : "Gato";
}

function mapSex(sex: PrismaPetSex): Pet["sex"] {
  return sex === "MACHO" ? "Macho" : "Hembra";
}

export function mapPet(
  pet: PrismaPet & {
    user: {
      name: string;
    };
  }
): Pet {
  return {
    id: pet.id,
    name: pet.name,
    species: mapSpecies(pet.species),
    breed: pet.breed,
    sex: mapSex(pet.sex),
    birthDate: pet.birthDate ? pet.birthDate.toISOString().slice(0, 10) : "",
    weight: pet.weightCurrent ?? 0,
    color: pet.color,
    avatar: pet.avatar,
    neutered: pet.isNeutered,
    microchipNumber: pet.microchipNumber ?? undefined,
    notes: pet.notes,
    tutorName: pet.user.name
  };
}

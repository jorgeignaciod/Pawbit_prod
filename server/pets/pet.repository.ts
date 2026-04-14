import { PetSex, PetSpecies } from "@prisma/client";

import { createToken } from "@/server/shared/ids";
import { prisma } from "@/server/db/prisma";
import { mapPet } from "@/server/pets/pet.mapper";
import { CreatePetInput, UpdatePetInput } from "@/server/pets/pet.schemas";

const DEFAULT_PET_AVATAR_BY_SPECIES: Record<CreatePetInput["species"], string> = {
  Perro: "/default-pet-dog.svg",
  Gato: "/default-pet-cat.svg"
};

function toSpecies(species: CreatePetInput["species"]) {
  return species === "Perro" ? PetSpecies.PERRO : PetSpecies.GATO;
}

function toSex(sex: CreatePetInput["sex"]) {
  return sex === "Macho" ? PetSex.MACHO : PetSex.HEMBRA;
}

export const petRepository = {
  async findByUserId(userId: number) {
    const pets = await prisma.pet.findMany({
      where: {
        userId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return pets.map(mapPet);
  },

  async findByIdForUser(petToken: string, userId: number) {
    const pet = await prisma.pet.findFirst({
      where: {
        token: petToken,
        userId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return pet ? mapPet(pet) : null;
  },

  async createForUser(userId: number, input: CreatePetInput) {
    const pet = await prisma.pet.create({
      data: {
        token: createToken("pet"),
        userId,
        name: input.name,
        species: toSpecies(input.species),
        breed: input.breed,
        sex: toSex(input.sex),
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        weightCurrent: input.weight ?? null,
        color: input.color,
        avatar: input.avatar || DEFAULT_PET_AVATAR_BY_SPECIES[input.species],
        isNeutered: input.neutered,
        microchipNumber: input.microchipNumber || null,
        notes: input.notes || ""
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return mapPet(pet);
  },

  async updateBasicForUser(petToken: string, userId: number, input: UpdatePetInput) {
    const pet = await prisma.pet.updateMany({
      where: {
        token: petToken,
        userId
      },
      data: {
        name: input.name,
        breed: input.breed,
        sex: toSex(input.sex),
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        avatar: input.avatar || undefined,
        microchipNumber: input.microchipNumber || null
      }
    });

    if (pet.count === 0) {
      return null;
    }

    return this.findByIdForUser(petToken, userId);
  }
};

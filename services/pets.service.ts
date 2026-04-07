import { Pet } from "@/types/pet";

interface PetsPayload {
  pets: Pet[];
}

interface PetPayload {
  pet: Pet;
}

export interface CreatePetPayload {
  name: string;
  species: "Perro" | "Gato";
  breed: string;
  sex: "Macho" | "Hembra";
  birthDate?: string;
  weight?: number | null;
  color: string;
  avatar?: string;
  neutered: boolean;
  microchipNumber?: string;
  notes?: string;
}

export interface UpdatePetPayload {
  name: string;
  breed: string;
  sex: "Macho" | "Hembra";
  birthDate?: string;
  avatar?: string;
  microchipNumber?: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    const message =
      typeof payload?.message === "string" ? payload.message : "No pudimos completar la solicitud.";

    throw new Error(message);
  }

  return payload as T;
}

export const petsService = {
  async getPets() {
    const response = await fetch("/api/pets", {
      method: "GET",
      credentials: "include"
    });
    const payload = await readResponse<PetsPayload>(response);

    return payload.pets;
  },

  async getPetById(id: string) {
    const response = await fetch(`/api/pets/${id}`, {
      method: "GET",
      credentials: "include"
    });

    if (response.status === 404) {
      return null;
    }

    const payload = await readResponse<PetPayload>(response);

    return payload.pet;
  },

  async createPet(input: CreatePetPayload) {
    const response = await fetch("/api/pets", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const payload = await readResponse<PetPayload>(response);

    return payload.pet;
  },

  async updatePet(id: string, input: UpdatePetPayload) {
    const response = await fetch(`/api/pets/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const payload = await readResponse<PetPayload>(response);

    return payload.pet;
  }
};

import { petsMock } from "@/mocks/pets.mock";
import { delay } from "@/lib/utils";

export const petsService = {
  async getPets() {
    await delay(500);
    return petsMock;
  },
  async getPetById(id: string) {
    await delay(350);
    return petsMock.find((pet) => pet.id === id) ?? null;
  }
};

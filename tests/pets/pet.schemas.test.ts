import { describe, expect, it } from "vitest";

import { createPetSchema, updatePetSchema } from "@/server/pets/pet.schemas";

describe("pet schemas", () => {
  it("acepta crear mascota con avatar relativo y microchip", () => {
    const result = createPetSchema.safeParse({
      name: "Mora",
      species: "Perro",
      breed: "Mestiza",
      sex: "Hembra",
      birthDate: "2021-08-14",
      weight: 12.4,
      color: "Canela",
      avatar: "/default-pet-dog.svg",
      neutered: true,
      microchipNumber: "985141000124578",
      notes: "Control anual al día"
    });

    expect(result.success).toBe(true);
  });

  it("rechaza avatar inválido", () => {
    const result = createPetSchema.safeParse({
      name: "Mora",
      species: "Perro",
      breed: "Mestiza",
      sex: "Hembra",
      color: "Canela",
      avatar: "avatar-invalido",
      neutered: true
    });

    expect(result.success).toBe(false);
  });

  it("acepta actualización básica válida", () => {
    const result = updatePetSchema.safeParse({
      name: "Simba",
      breed: "Europeo de pelo corto",
      sex: "Macho",
      birthDate: "2019-11-05",
      avatar: "",
      microchipNumber: ""
    });

    expect(result.success).toBe(true);
  });
});

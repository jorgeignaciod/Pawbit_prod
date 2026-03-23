export type PetSpecies = "Perro" | "Gato";
export type PetSex = "Macho" | "Hembra";

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  sex: PetSex;
  birthDate: string;
  weight: number;
  color: string;
  avatar: string;
  neutered: boolean;
  notes: string;
  tutorName: string;
}

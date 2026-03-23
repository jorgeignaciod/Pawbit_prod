import { Pet } from "@/types/pet";

export const petsMock: Pet[] = [
  {
    id: "pet-1",
    name: "Mora",
    species: "Perro",
    breed: "Mestiza",
    sex: "Hembra",
    birthDate: "2021-08-14",
    weight: 12.4,
    color: "Canela",
    avatar:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80",
    neutered: true,
    notes: "Le cuesta tolerar viajes largos y necesita premio después del control.",
    tutorName: "Jorge Cifuentes"
  },
  {
    id: "pet-2",
    name: "Simba",
    species: "Gato",
    breed: "Europeo de pelo corto",
    sex: "Macho",
    birthDate: "2019-11-05",
    weight: 5.8,
    color: "Atigrado gris",
    avatar:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
    neutered: true,
    notes: "Alergia estacional leve. Prefiere visitas por la mañana.",
    tutorName: "Jorge Cifuentes"
  }
];

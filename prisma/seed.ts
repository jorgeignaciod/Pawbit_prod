import { PrismaClient, DocumentType, PetSex, PetSpecies } from "@prisma/client";

import { hashPassword } from "@/server/auth/password";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "jorge@pawbit.app"
    },
    update: {
      name: "Jorge Cifuentes",
      phone: "+56 9 8765 4321",
      country: "Chile",
      city: "Santiago",
      documentType: DocumentType.RUT,
      documentNumber: "18.245.331-6",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
      onboardingCompleted: true
    },
    create: {
      id: "user_seed_jorge",
      name: "Jorge Cifuentes",
      email: "jorge@pawbit.app",
      phone: "+56 9 8765 4321",
      country: "Chile",
      city: "Santiago",
      documentType: DocumentType.RUT,
      documentNumber: "18.245.331-6",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
      passwordHash: hashPassword("Pawbit123"),
      onboardingCompleted: true
    }
  });

  await prisma.pet.upsert({
    where: { id: "pet_seed_mora" },
    update: {
      userId: user.id,
      name: "Mora",
      species: PetSpecies.PERRO,
      breed: "Mestiza",
      sex: PetSex.HEMBRA,
      birthDate: new Date("2021-08-14"),
      weightCurrent: 12.4,
      color: "Canela",
      avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80",
      isNeutered: true,
      microchipNumber: "985141000124578",
      notes: "Le cuesta tolerar viajes largos y necesita premio después del control."
    },
    create: {
      id: "pet_seed_mora",
      userId: user.id,
      name: "Mora",
      species: PetSpecies.PERRO,
      breed: "Mestiza",
      sex: PetSex.HEMBRA,
      birthDate: new Date("2021-08-14"),
      weightCurrent: 12.4,
      color: "Canela",
      avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80",
      isNeutered: true,
      microchipNumber: "985141000124578",
      notes: "Le cuesta tolerar viajes largos y necesita premio después del control."
    }
  });

  await prisma.pet.upsert({
    where: { id: "pet_seed_simba" },
    update: {
      userId: user.id,
      name: "Simba",
      species: PetSpecies.GATO,
      breed: "Europeo de pelo corto",
      sex: PetSex.MACHO,
      birthDate: new Date("2019-11-05"),
      weightCurrent: 5.8,
      color: "Atigrado gris",
      avatar: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
      isNeutered: true,
      microchipNumber: "990000123456781",
      notes: "Alergia estacional leve. Prefiere visitas por la mañana."
    },
    create: {
      id: "pet_seed_simba",
      userId: user.id,
      name: "Simba",
      species: PetSpecies.GATO,
      breed: "Europeo de pelo corto",
      sex: PetSex.MACHO,
      birthDate: new Date("2019-11-05"),
      weightCurrent: 5.8,
      color: "Atigrado gris",
      avatar: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
      isNeutered: true,
      microchipNumber: "990000123456781",
      notes: "Alergia estacional leve. Prefiere visitas por la mañana."
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PetHealthPageClient } from "@/components/health/pet-health-page-client";
import { petsMock } from "@/mocks/pets.mock";

export function generateStaticParams() {
  return petsMock.map((pet) => ({ id: pet.id }));
}

export default async function PetHealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <PetHealthPageClient petId={id} />;
}

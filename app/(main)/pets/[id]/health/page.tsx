import { PetHealthPageClient } from "@/components/health/pet-health-page-client";

export const dynamic = "force-dynamic";

export default async function PetHealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <PetHealthPageClient petId={id} />;
}

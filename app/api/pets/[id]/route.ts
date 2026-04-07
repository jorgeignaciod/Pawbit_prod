import { getCurrentUserFromRequest } from "@/server/auth/auth-session";
import { petRepository } from "@/server/pets/pet.repository";
import { updatePetSchema } from "@/server/pets/pet.schemas";
import { jsonResponse, validationErrorResponse } from "@/server/shared/api-response";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUserFromRequest();

  if (!currentUser) {
    return jsonResponse(
      {
        error: "unauthorized",
        message: "No hay una sesion activa"
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const pet = await petRepository.findByIdForUser(id, currentUser.id);

  if (!pet) {
    return jsonResponse(
      {
        error: "not_found",
        message: "No encontramos la mascota solicitada"
      },
      { status: 404 }
    );
  }

  return jsonResponse({ pet });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUserFromRequest();

  if (!currentUser) {
    return jsonResponse(
      {
        error: "unauthorized",
        message: "No hay una sesion activa"
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsed = updatePetSchema.safeParse(payload);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const pet = await petRepository.updateBasicForUser(id, currentUser.id, parsed.data);

  if (!pet) {
    return jsonResponse(
      {
        error: "not_found",
        message: "No encontramos la mascota solicitada"
      },
      { status: 404 }
    );
  }

  return jsonResponse({ pet });
}

import { getCurrentUserFromRequest } from "@/server/auth/auth-session";
import { createPetSchema } from "@/server/pets/pet.schemas";
import { petRepository } from "@/server/pets/pet.repository";
import { internalServerErrorResponse, jsonResponse, logApiError, validationErrorResponse } from "@/server/shared/api-response";

export async function GET() {
  try {
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

    const pets = await petRepository.findByUserId(currentUser.id);

    return jsonResponse({ pets });
  } catch (error) {
    logApiError("pets.list", error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: Request) {
  try {
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

    const payload = await request.json().catch(() => null);
    const parsed = createPetSchema.safeParse(payload);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const pet = await petRepository.createForUser(currentUser.id, parsed.data);

    return jsonResponse({ pet }, { status: 201 });
  } catch (error) {
    logApiError("pets.create", error);
    return internalServerErrorResponse();
  }
}

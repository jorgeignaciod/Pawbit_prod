import { getCurrentUserFromRequest } from "@/server/auth/auth-session";
import { recordRepository } from "@/server/records/record.repository";
import { createHealthRecordSchema } from "@/server/records/record.schemas";
import { jsonResponse, validationErrorResponse } from "@/server/shared/api-response";

export async function POST(request: Request) {
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
  const parsed = createHealthRecordSchema.safeParse(payload);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const record = await recordRepository.createForUser(currentUser.id, parsed.data);

  if (!record) {
    return jsonResponse(
      {
        error: "pet_not_found",
        message: "No encontramos la mascota seleccionada"
      },
      { status: 404 }
    );
  }

  return jsonResponse({ record }, { status: 201 });
}

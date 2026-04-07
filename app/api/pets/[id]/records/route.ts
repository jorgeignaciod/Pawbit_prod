import { getCurrentUserFromRequest } from "@/server/auth/auth-session";
import { recordRepository } from "@/server/records/record.repository";
import { jsonResponse } from "@/server/shared/api-response";

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
  const records = await recordRepository.findByPetIdForUser(id, currentUser.id);

  return jsonResponse({ records });
}

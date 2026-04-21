import { cookies } from "next/headers";

import { onboardingSchema } from "@/server/auth/auth.schemas";
import { authService } from "@/server/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { internalServerErrorResponse, jsonResponse, logApiError, validationErrorResponse } from "@/server/shared/api-response";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const currentUser = await authService.getStoredUserBySessionToken(sessionToken);

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
    const parsed = onboardingSchema.safeParse(payload);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const updatedUser = await authService.completeOnboarding(currentUser.id, parsed.data);

    if (!updatedUser) {
      return jsonResponse(
        {
          error: "user_not_found",
          message: "No se encontro el usuario autenticado"
        },
        { status: 404 }
      );
    }

    return jsonResponse({ user: updatedUser });
  } catch (error) {
    logApiError("me.onboarding", error);
    return internalServerErrorResponse();
  }
}

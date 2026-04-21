import { cookies } from "next/headers";

import { authService } from "@/server/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { internalServerErrorResponse, jsonResponse, logApiError } from "@/server/shared/api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = await authService.getUserBySessionToken(sessionToken);

    if (!user) {
      return jsonResponse(
        {
          error: "unauthorized",
          message: "No hay una sesion activa"
        },
        { status: 401 }
      );
    }

    return jsonResponse({ user });
  } catch (error) {
    logApiError("auth.me", error);
    return internalServerErrorResponse();
  }
}

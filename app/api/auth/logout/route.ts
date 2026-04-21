import { cookies } from "next/headers";

import { authService } from "@/server/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { internalServerErrorResponse, jsonResponse, logApiError } from "@/server/shared/api-response";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    await authService.logout(sessionToken);

    const response = jsonResponse({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    logApiError("auth.logout", error);
    return internalServerErrorResponse();
  }
}

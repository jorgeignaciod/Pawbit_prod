import { loginSchema } from "@/server/auth/auth.schemas";
import { authService } from "@/server/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { internalServerErrorResponse, jsonResponse, logApiError, validationErrorResponse } from "@/server/shared/api-response";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const result = await authService.login(parsed.data);

    if (!result.ok) {
      return jsonResponse(
        {
          error: "invalid_credentials",
          message: result.message
        },
        { status: result.status }
      );
    }

    const response = jsonResponse({
      user: result.user
    });

    response.cookies.set(SESSION_COOKIE_NAME, result.session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(result.session.expiresAt)
    });

    return response;
  } catch (error) {
    logApiError("auth.login", error);
    return internalServerErrorResponse();
  }
}

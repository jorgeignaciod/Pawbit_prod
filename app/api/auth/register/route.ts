import { registerSchema } from "@/server/auth/auth.schemas";
import { authService } from "@/server/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { jsonResponse, validationErrorResponse } from "@/server/shared/api-response";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const result = await authService.register(parsed.data);

  if (!result.ok) {
    return jsonResponse(
      {
        error: "email_taken",
        message: result.message
      },
      { status: result.status }
    );
  }

  const response = jsonResponse(
    {
      user: result.user
    },
    { status: result.status }
  );

  response.cookies.set(SESSION_COOKIE_NAME, result.session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(result.session.expiresAt)
  });

  return response;
}

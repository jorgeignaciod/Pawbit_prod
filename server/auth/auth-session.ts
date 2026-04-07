import { cookies } from "next/headers";

import { authService } from "@/server/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";

export async function getCurrentUserFromRequest() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return authService.getUserBySessionToken(sessionToken);
}

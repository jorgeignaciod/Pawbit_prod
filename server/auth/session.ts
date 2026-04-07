import { randomBytes, createHash } from "node:crypto";

export const SESSION_COOKIE_NAME = "pawbit_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

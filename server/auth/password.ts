import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_COST = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_COST).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, encodedPassword: string) {
  const [salt, storedHash] = encodedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = scryptSync(password, salt, SCRYPT_COST);
  const originalHash = Buffer.from(storedHash, "hex");

  if (candidateHash.length !== originalHash.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, originalHash);
}

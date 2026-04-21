import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "@/server/auth/password";

describe("password helpers", () => {
  it("genera un hash verificable", () => {
    const encoded = hashPassword("Pawbit123");

    expect(encoded).toContain(":");
    expect(verifyPassword("Pawbit123", encoded)).toBe(true);
  });

  it("rechaza una contraseña incorrecta", () => {
    const encoded = hashPassword("Pawbit123");

    expect(verifyPassword("Pawbit321", encoded)).toBe(false);
  });

  it("rechaza un formato inválido", () => {
    expect(verifyPassword("Pawbit123", "sin-formato")).toBe(false);
  });
});

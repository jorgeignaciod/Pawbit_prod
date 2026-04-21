import { describe, expect, it } from "vitest";

import { loginSchema, onboardingSchema, registerSchema } from "@/server/auth/auth.schemas";

describe("auth schemas", () => {
  it("acepta un registro válido y normaliza email", () => {
    const parsed = registerSchema.parse({
      name: "Jorge Diaz",
      email: "JORGE@PAWBIT.APP ",
      password: "Pawbit123"
    });

    expect(parsed.email).toBe("jorge@pawbit.app");
  });

  it("rechaza una contraseña débil", () => {
    const result = registerSchema.safeParse({
      name: "Jorge Diaz",
      email: "jorge@pawbit.app",
      password: "pawbit"
    });

    expect(result.success).toBe(false);
  });

  it("acepta login válido", () => {
    const result = loginSchema.safeParse({
      email: "jorge@pawbit.app",
      password: "Pawbit123"
    });

    expect(result.success).toBe(true);
  });

  it("rechaza documento con caracteres inválidos en onboarding", () => {
    const result = onboardingSchema.safeParse({
      country: "Chile",
      documentType: "RUT",
      documentNumber: "18.245.331-6#"
    });

    expect(result.success).toBe(false);
  });
});

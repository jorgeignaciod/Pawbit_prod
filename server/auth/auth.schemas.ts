import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un correo valido")
    .max(120, "El correo no puede exceder 120 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede exceder 72 caracteres")
    .regex(/[A-Z]/, "La contraseña debe incluir al menos una mayuscula")
    .regex(/[a-z]/, "La contraseña debe incluir al menos una minuscula")
    .regex(/[0-9]/, "La contraseña debe incluir al menos un numero"),
  phone: z
    .string()
    .trim()
    .min(8, "Ingresa un telefono valido")
    .max(30, "El telefono no puede exceder 30 caracteres")
    .optional()
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un correo valido"),
  password: z.string().min(1, "Ingresa tu contraseña")
});

export const onboardingSchema = z.object({
  country: z.string().trim().min(2, "Selecciona un pais"),
  documentType: z.enum(["RUT", "DNI"]),
  documentNumber: z
    .string()
    .trim()
    .min(5, "Ingresa un documento valido")
    .max(30, "El documento no puede exceder 30 caracteres")
    .regex(/^[0-9A-Za-z.\-]+$/, "Usa solo caracteres validos")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

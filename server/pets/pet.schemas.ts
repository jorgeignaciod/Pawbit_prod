import { z } from "zod";

const absoluteUrlSchema = z.string().url();

const avatarSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value) || absoluteUrlSchema.safeParse(value).success, {
    message: "Avatar invalido"
  });

export const createPetSchema = z.object({
  name: z.string().trim().min(2, "Ingresa el nombre").max(80, "El nombre es demasiado largo"),
  species: z.enum(["Perro", "Gato"]),
  breed: z.string().trim().min(2, "Ingresa la raza").max(120, "La raza es demasiado larga"),
  sex: z.enum(["Macho", "Hembra"]),
  birthDate: z.string().date().optional().or(z.literal("")),
  weight: z.number().min(0).max(200).nullable().optional(),
  color: z.string().trim().min(2, "Ingresa el color").max(80, "El color es demasiado largo"),
  avatar: avatarSchema.optional().or(z.literal("")),
  neutered: z.boolean(),
  microchipNumber: z.string().trim().max(50, "El microchip es demasiado largo").optional().or(z.literal("")),
  notes: z.string().trim().max(500, "Las notas son demasiado largas").optional().or(z.literal(""))
});

export type CreatePetInput = z.infer<typeof createPetSchema>;

export const updatePetSchema = z.object({
  name: z.string().trim().min(2, "Ingresa el nombre").max(80, "El nombre es demasiado largo"),
  breed: z.string().trim().min(2, "Ingresa la raza").max(120, "La raza es demasiado larga"),
  sex: z.enum(["Macho", "Hembra"]),
  birthDate: z.string().date().optional().or(z.literal("")),
  avatar: avatarSchema.optional().or(z.literal("")),
  microchipNumber: z.string().trim().max(50, "El microchip es demasiado largo").optional().or(z.literal(""))
});

export type UpdatePetInput = z.infer<typeof updatePetSchema>;

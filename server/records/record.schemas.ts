import { z } from "zod";

const optionalText = z.string().trim().max(500, "Texto demasiado largo").optional().or(z.literal(""));

export const createWeightRecordSchema = z.object({
  kind: z.literal("weight"),
  petId: z.string().min(1, "Selecciona una mascota"),
  weight: z.number().positive("Ingresa un peso valido").max(200, "El peso es demasiado alto"),
  notes: optionalText
});

export const createVaccineRecordSchema = z.object({
  kind: z.literal("vaccine"),
  petId: z.string().min(1, "Selecciona una mascota"),
  vaccineName: z.string().trim().min(2, "Ingresa el nombre de la vacuna").max(120, "Nombre demasiado largo"),
  dose: z.string().trim().min(1, "Ingresa la dosis").max(80, "Dosis demasiado larga"),
  notes: optionalText,
  scheduleNextDose: z.boolean().optional().default(false)
});

export const createMedicationRecordSchema = z.object({
  kind: z.literal("medication"),
  petId: z.string().min(1, "Selecciona una mascota"),
  medicationName: z.string().trim().min(2, "Ingresa el nombre del medicamento").max(120, "Nombre demasiado largo"),
  dose: z.string().trim().min(1, "Ingresa la dosis").max(80, "Dosis demasiado larga"),
  frequency: z.string().trim().min(2, "Ingresa la frecuencia").max(160, "Frecuencia demasiado larga"),
  notes: optionalText,
  scheduleReminder: z.boolean().optional().default(false)
});

export const createNoteRecordSchema = z.object({
  kind: z.literal("note"),
  petId: z.string().min(1, "Selecciona una mascota"),
  title: z.string().trim().min(2, "Ingresa un titulo corto").max(120, "Titulo demasiado largo"),
  content: z.string().trim().min(6, "Agrega una nota util").max(1000, "La nota es demasiado larga"),
  tag: z.string().trim().max(60, "Etiqueta demasiado larga").optional().or(z.literal(""))
});

export const createHealthRecordSchema = z.discriminatedUnion("kind", [
  createWeightRecordSchema,
  createVaccineRecordSchema,
  createMedicationRecordSchema,
  createNoteRecordSchema
]);

export type CreateHealthRecordInput = z.infer<typeof createHealthRecordSchema>;

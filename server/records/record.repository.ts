import { MedicalRecordType } from "@prisma/client";

import { prisma } from "@/server/db/prisma";
import { mapHealthRecord } from "@/server/records/record.mapper";
import { CreateHealthRecordInput } from "@/server/records/record.schemas";
import { createId } from "@/server/shared/ids";

export const recordRepository = {
  async findByPetIdForUser(petId: string, userId: string) {
    const records = await prisma.medicalRecord.findMany({
      where: {
        petId,
        pet: {
          userId
        }
      },
      orderBy: {
        recordedAt: "desc"
      }
    });

    return records.map(mapHealthRecord);
  },

  async createForUser(userId: string, input: CreateHealthRecordInput) {
    const pet = await prisma.pet.findFirst({
      where: {
        id: input.petId,
        userId
      }
    });

    if (!pet) {
      return null;
    }

    const now = new Date();

    if (input.kind === "weight") {
      const result = await prisma.$transaction(async (tx) => {
        await tx.pet.update({
          where: {
            id: pet.id
          },
          data: {
            weightCurrent: input.weight
          }
        });

        return tx.medicalRecord.create({
          data: {
            id: createId("record"),
            petId: pet.id,
            type: MedicalRecordType.PESO,
            title: "Control de peso",
            description: input.notes || `Peso registrado: ${input.weight} kg.`,
            recordedAt: now,
            createdByUserId: userId,
            metadata: {
              weightKg: input.weight
            }
          }
        });
      });

      return mapHealthRecord(result);
    }

    if (input.kind === "vaccine") {
      const record = await prisma.medicalRecord.create({
        data: {
          id: createId("record"),
          petId: pet.id,
          type: MedicalRecordType.VACUNA,
          title: input.vaccineName,
          description: input.notes || `Dosis aplicada: ${input.dose}.`,
          recordedAt: now,
          nextDueDate: null,
          createdByUserId: userId,
          metadata: {
            dose: input.dose,
            scheduleNextDose: input.scheduleNextDose
          }
        }
      });

      return mapHealthRecord(record);
    }

    if (input.kind === "medication") {
      const record = await prisma.medicalRecord.create({
        data: {
          id: createId("record"),
          petId: pet.id,
          type: MedicalRecordType.TRATAMIENTO,
          title: input.medicationName,
          description: input.notes || `Dosis: ${input.dose}. Frecuencia: ${input.frequency}.`,
          recordedAt: now,
          createdByUserId: userId,
          metadata: {
            dose: input.dose,
            frequency: input.frequency,
            scheduleReminder: input.scheduleReminder
          }
        }
      });

      return mapHealthRecord(record);
    }

    const record = await prisma.medicalRecord.create({
      data: {
        id: createId("record"),
        petId: pet.id,
        type: MedicalRecordType.NOTA,
        title: input.title,
        description: input.content,
        recordedAt: now,
        createdByUserId: userId,
        metadata: {
          tag: input.tag || null
        }
      }
    });

    return mapHealthRecord(record);
  }
};

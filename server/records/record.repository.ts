import { MedicalRecordType } from "@prisma/client";

import { prisma } from "@/server/db/prisma";
import { mapHealthRecord } from "@/server/records/record.mapper";
import { CreateHealthRecordInput } from "@/server/records/record.schemas";
import { createToken } from "@/server/shared/ids";

export const recordRepository = {
  async findByPetIdForUser(petToken: string, userId: number) {
    const records = await prisma.medicalRecord.findMany({
      where: {
        pet: {
          token: petToken,
          userId
        },
      },
      include: {
        pet: {
          select: {
            token: true
          }
        }
      },
      orderBy: {
        recordedAt: "desc"
      }
    });

    return records.map(mapHealthRecord);
  },

  async createForUser(userId: number, input: CreateHealthRecordInput) {
    const pet = await prisma.pet.findFirst({
      where: {
        token: input.petId,
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
            token: createToken("record"),
            petId: pet.id,
            type: MedicalRecordType.PESO,
            title: "Control de peso",
            description: input.notes || `Peso registrado: ${input.weight} kg.`,
            recordedAt: now,
            createdByUserId: userId,
            metadata: {
              weightKg: input.weight
            }
          },
          include: {
            pet: {
              select: {
                token: true
              }
            }
          }
        });
      });

      return mapHealthRecord(result);
    }

    if (input.kind === "vaccine") {
      const record = await prisma.medicalRecord.create({
        data: {
          token: createToken("record"),
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
        },
        include: {
          pet: {
            select: {
              token: true
            }
          }
        }
      });

      return mapHealthRecord(record);
    }

    if (input.kind === "medication") {
      const record = await prisma.medicalRecord.create({
        data: {
          token: createToken("record"),
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
        },
        include: {
          pet: {
            select: {
              token: true
            }
          }
        }
      });

      return mapHealthRecord(record);
    }

    const record = await prisma.medicalRecord.create({
      data: {
        token: createToken("record"),
        petId: pet.id,
        type: MedicalRecordType.NOTA,
        title: input.title,
        description: input.content,
        recordedAt: now,
        createdByUserId: userId,
        metadata: {
          tag: input.tag || null
        }
      },
      include: {
        pet: {
          select: {
            token: true
          }
        }
      }
    });

    return mapHealthRecord(record);
  }
};

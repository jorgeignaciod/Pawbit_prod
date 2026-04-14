import { MedicalRecord, MedicalRecordType } from "@prisma/client";

import { HealthRecord, HealthRecordType } from "@/types/health-record";

function mapRecordType(type: MedicalRecordType): HealthRecordType {
  if (type === "VACUNA") return "Vacuna";
  if (type === "CONSULTA") return "Consulta";
  if (type === "ALERGIA") return "Alergia";
  if (type === "DIAGNOSTICO") return "Diagnóstico";
  if (type === "TRATAMIENTO") return "Tratamiento";
  if (type === "NOTA") return "Nota";

  return "Peso";
}

export function mapHealthRecord(
  record: MedicalRecord & {
    token: string;
    pet?: {
      token: string;
    };
  }
): HealthRecord {
  return {
    id: record.token,
    petId: record.pet?.token ?? String(record.petId),
    type: mapRecordType(record.type),
    title: record.title,
    description: record.description,
    date: record.recordedAt.toISOString(),
    vetName: record.vetName ?? "",
    attachments: [],
    nextDueDate: record.nextDueDate?.toISOString(),
    metadata: record.metadata ?? undefined
  };
}

import { HealthRecord } from "@/types/health-record";

interface RecordsPayload {
  records: HealthRecord[];
}

interface RecordPayload {
  record: HealthRecord;
}

export interface CreateWeightRecordPayload {
  petId: string;
  weight: number;
  notes?: string;
}

export interface CreateVaccineRecordPayload {
  petId: string;
  vaccineName: string;
  dose: string;
  notes?: string;
  scheduleNextDose?: boolean;
}

export interface CreateMedicationRecordPayload {
  petId: string;
  medicationName: string;
  dose: string;
  frequency: string;
  notes?: string;
  scheduleReminder?: boolean;
}

export interface CreateNoteRecordPayload {
  petId: string;
  title: string;
  content: string;
  tag?: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    const message =
      typeof payload?.message === "string" ? payload.message : "No pudimos completar la solicitud.";

    throw new Error(message);
  }

  return payload as T;
}

export const recordsService = {
  async getRecordsByPetId(petId: string) {
    const response = await fetch(`/api/pets/${petId}/records`, {
      method: "GET",
      credentials: "include"
    });
    const payload = await readResponse<RecordsPayload>(response);

    return payload.records;
  },

  async createWeightRecord(input: CreateWeightRecordPayload) {
    const response = await fetch("/api/records", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: "weight",
        ...input
      })
    });

    const payload = await readResponse<RecordPayload>(response);

    return payload.record;
  },

  async createVaccineRecord(input: CreateVaccineRecordPayload) {
    const response = await fetch("/api/records", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: "vaccine",
        ...input
      })
    });

    const payload = await readResponse<RecordPayload>(response);

    return payload.record;
  },

  async createMedicationRecord(input: CreateMedicationRecordPayload) {
    const response = await fetch("/api/records", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: "medication",
        ...input
      })
    });

    const payload = await readResponse<RecordPayload>(response);

    return payload.record;
  },

  async createNoteRecord(input: CreateNoteRecordPayload) {
    const response = await fetch("/api/records", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: "note",
        ...input
      })
    });

    const payload = await readResponse<RecordPayload>(response);

    return payload.record;
  }
};

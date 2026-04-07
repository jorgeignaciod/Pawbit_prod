export type HealthRecordType =
  | "Vacuna"
  | "Consulta"
  | "Alergia"
  | "Diagnóstico"
  | "Tratamiento"
  | "Peso"
  | "Nota";

export interface HealthRecord {
  id: string;
  petId: string;
  type: HealthRecordType;
  title: string;
  description: string;
  date: string;
  vetName: string;
  attachments: string[];
  nextDueDate?: string;
  metadata?: unknown;
}

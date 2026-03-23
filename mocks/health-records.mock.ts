import { HealthRecord } from "@/types/health-record";

export const healthRecordsMock: HealthRecord[] = [
  {
    id: "record-1",
    petId: "pet-1",
    type: "Vacuna",
    title: "Vacuna séxtuple",
    description: "Aplicación anual al día, sin reacción posterior.",
    date: "2026-03-12",
    vetName: "Dra. Antonia Reyes",
    attachments: ["certificado-vacuna.pdf"],
    nextDueDate: "2027-03-12"
  },
  {
    id: "record-2",
    petId: "pet-1",
    type: "Consulta",
    title: "Control digestivo",
    description: "Revisión por sensibilidad estomacal. Se indicó dieta blanda por 5 días.",
    date: "2026-02-07",
    vetName: "Dr. Tomás Vega",
    attachments: ["indicaciones-consulta.pdf"]
  },
  {
    id: "record-3",
    petId: "pet-2",
    type: "Alergia",
    title: "Dermatitis estacional",
    description: "Brotes leves durante primavera. Recomendado control de pulgas y shampoo específico.",
    date: "2025-10-10",
    vetName: "Dra. Camila Soto",
    attachments: []
  },
  {
    id: "record-4",
    petId: "pet-2",
    type: "Tratamiento",
    title: "Suplemento urinario",
    description: "Suplemento preventivo por 30 días después del último control.",
    date: "2026-01-18",
    vetName: "Dra. Camila Soto",
    attachments: ["tratamiento-enero.pdf"]
  },
  {
    id: "record-5",
    petId: "pet-2",
    type: "Peso",
    title: "Control de peso",
    description: "Peso estable, dentro del rango objetivo.",
    date: "2026-03-01",
    vetName: "Dra. Camila Soto",
    attachments: []
  }
];

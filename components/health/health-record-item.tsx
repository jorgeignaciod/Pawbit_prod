import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Syringe, Stethoscope, Weight } from "lucide-react";

import { HealthRecord } from "@/types/health-record";

const iconMap = {
  Vacuna: Syringe,
  Consulta: Stethoscope,
  Alergia: FileText,
  Diagnóstico: FileText,
  Tratamiento: FileText,
  Peso: Weight
} as const;

export function HealthRecordItem({ record }: { record: HealthRecord }) {
  const Icon = iconMap[record.type];
  const badgeClass =
    record.type === "Vacuna"
      ? "bg-pawbit-success-bg text-pawbit-success"
      : record.type === "Peso"
        ? "bg-pawbit-error-bg text-pawbit-primary"
        : "bg-[#fff1df] text-[#de8b14]";

  return (
    <article className="relative pl-8">
      <span className="absolute left-[11px] top-0 h-full w-px bg-pawbit-error-bg" />
      <span className="absolute left-0 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-pawbit-error-bg text-pawbit-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>

      <div className="surface-card flex items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <p className="text-[19px] font-semibold text-pawbit-text">{record.title}</p>
          <p className="mt-1 text-[15px] text-pawbit-muted">{format(new Date(record.date), "dd MMM yyyy", { locale: es })}</p>
        </div>
        <span className={`rounded-pill px-3 py-2 text-sm font-semibold ${badgeClass}`}>
          {record.type === "Vacuna" ? "Completado" : record.type === "Peso" ? "9,4 kg" : "Notas"}
        </span>
      </div>
    </article>
  );
}

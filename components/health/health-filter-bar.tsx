import { FilterChipOption, FilterChips } from "@/components/ui/filter-chips";

const options: FilterChipOption[] = [
  { label: "Todo", value: "Todos" },
  { label: "Vacunas", value: "Vacuna" },
  { label: "Peso", value: "Peso" },
  { label: "Consultas", value: "Consulta" },
  { label: "Alergias", value: "Alergia" },
  { label: "Tratamientos", value: "Tratamiento" },
  { label: "Notas", value: "Nota" }
];

export function HealthFilterBar({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return <FilterChips options={options} value={value} onChange={onChange} />;
}

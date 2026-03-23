export function StatCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs text-pawbit-muted">{label}</p>
      <p className="mt-2 text-[24px] font-semibold leading-[30px] text-pawbit-text">{value}</p>
      <p className="mt-1 text-xs text-pawbit-muted">{helper}</p>
    </div>
  );
}

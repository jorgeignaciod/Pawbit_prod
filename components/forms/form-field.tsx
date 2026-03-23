export function FormField({
  label,
  helper,
  error,
  children
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[16px] font-semibold text-pawbit-text">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-pawbit-error">{error}</span>
      ) : helper ? (
        <span className="text-xs text-pawbit-muted">{helper}</span>
      ) : null}
    </label>
  );
}

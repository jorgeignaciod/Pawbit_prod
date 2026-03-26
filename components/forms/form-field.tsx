export function FormField({
  label,
  helper,
  required = false,
  error,
  children
}: {
  label: React.ReactNode;
  helper?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[16px] font-semibold text-pawbit-text">
        {label}
        {required ? <span className="ml-1 text-pawbit-error">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-pawbit-error">{error}</span>
      ) : helper ? (
        <span className="text-xs text-pawbit-muted">{helper}</span>
      ) : null}
    </label>
  );
}

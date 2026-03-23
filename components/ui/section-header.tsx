export function SectionHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="space-y-1">
        <h2 className="text-[15px] font-semibold uppercase tracking-[0.1em] text-[#9aa8c0]">{title}</h2>
        {subtitle ? <p className="text-sm text-pawbit-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

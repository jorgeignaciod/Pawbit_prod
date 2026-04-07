"use client";

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-pawbit-stroke" />
      <span className="text-[15px] font-semibold text-pawbit-text">{label}</span>
      <div className="h-px flex-1 bg-pawbit-stroke" />
    </div>
  );
}

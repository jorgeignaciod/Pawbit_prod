import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className={compact ? "h-9 w-9" : "h-16 w-16"}
        fill="none"
      >
        <rect x="5" y="5" width="54" height="54" rx="20" stroke="#34363B" strokeWidth="3" />
        <path d="M22 42c3.8 0 5.8-4.4 10-4.4s6.2 4.4 10 4.4c3.7 0 6-2.6 6-6 0-4.9-4.5-8.2-7.8-10a12.4 12.4 0 0 0-16.4 0C20.5 27.8 16 31.1 16 36c0 3.4 2.3 6 6 6Z" fill="#34363B" />
        <circle cx="23" cy="24" r="4.3" fill="#34363B" />
        <circle cx="32" cy="20" r="4.3" fill="#34363B" />
        <circle cx="41" cy="24" r="4.3" fill="#34363B" />
      </svg>
      {!compact && (
        <div>
          <div className="text-[40px] font-bold leading-none tracking-[-0.04em] text-[#1F2433]">
            PawBit
          </div>
          <p className="mt-4 text-[17px] text-pawbit-muted">Registra. Recuerda. Cuida.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";

export function AuthLogoBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? "gap-3" : "gap-4"}`}>
      <div className="overflow-hidden rounded-[28px]">
        <Image
          src="/logo.png"
          alt="PawBit"
          width={compact ? 132 : 160}
          height={compact ? 132 : 160}
          priority
          className={compact ? "h-32 w-32 object-cover" : "h-40 w-40 object-cover"}
        />
      </div>
      <p className="text-[17px] font-medium text-pawbit-text">Registra - Recuerda - Cuida</p>
    </div>
  );
}

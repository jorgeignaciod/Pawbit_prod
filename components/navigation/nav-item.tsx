"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { bottomNavigationItems } from "@/constants/navigation";

export function NavItem({
  href,
  label,
  icon: Icon
}: (typeof bottomNavigationItems)[number]) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const isRegister = href === "/register";

  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-end gap-1 rounded-md px-1 pb-1 text-center text-[12px] font-medium",
        active ? "text-pawbit-primary" : "text-[#94a2bb]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          isRegister ? "mb-1 h-14 w-14 rounded-full bg-pawbit-primary text-white shadow-coral" : "h-8 w-8"
        )}
      >
        <Icon className={cn(isRegister ? "h-7 w-7" : "h-6 w-6", active && !isRegister ? "text-pawbit-primary" : "")} />
      </div>
      <span className="truncate">{label}</span>
    </Link>
  );
}

"use client";

import { bottomNavigationItems } from "@/constants/navigation";

import { NavItem } from "@/components/navigation/nav-item";

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-pawbit-stroke/90 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 backdrop-blur">
      <div className="flex h-[68px] items-end justify-between gap-1">
        {bottomNavigationItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
}

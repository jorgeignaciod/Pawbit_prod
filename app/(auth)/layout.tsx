"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks/use-mounted";
import { useAppStore } from "@/store/app-store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useMounted();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!mounted || !isAuthenticated) {
      return;
    }

    router.replace("/home");
  }, [isAuthenticated, mounted, router]);

  if (!mounted) {
    return <main className="app-frame min-h-screen" />;
  }

  return <main className="app-frame min-h-screen">{children}</main>;
}

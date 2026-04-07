"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks/use-mounted";
import { useAppStore } from "@/store/app-store";

export default function RootPage() {
  const router = useRouter();
  const mounted = useMounted();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    router.replace("/home");
  }, [isAuthenticated, mounted, router]);

  return <main className="app-frame" />;
}

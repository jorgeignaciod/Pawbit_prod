"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks/use-mounted";
import { useAppStore } from "@/store/app-store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useMounted();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);

  useEffect(() => {
    if (!mounted || !isAuthenticated) {
      return;
    }

    router.replace(onboardingCompleted ? "/home" : "/onboarding");
  }, [isAuthenticated, mounted, onboardingCompleted, router]);

  if (!mounted) {
    return <main className="app-frame min-h-screen" />;
  }

  return <main className="app-frame min-h-screen">{children}</main>;
}

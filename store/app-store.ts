"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { userMock } from "@/mocks/user.mock";
import { User } from "@/types/user";

interface AppStore {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  user: User | null;
  login: (user?: User) => void;
  completeOnboarding: (payload: Pick<User, "country" | "documentType" | "documentNumber">) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      onboardingCompleted: false,
      user: null,
      login: (user = userMock) =>
        set({
          isAuthenticated: true,
          user
        }),
      completeOnboarding: (payload) =>
        set((state) => ({
          onboardingCompleted: true,
          user: state.user ? { ...state.user, ...payload } : { ...userMock, ...payload }
        })),
      logout: () =>
        set({
          isAuthenticated: false,
          onboardingCompleted: false,
          user: null
        })
    }),
    {
      name: "pawbit-app-store"
    }
  )
);

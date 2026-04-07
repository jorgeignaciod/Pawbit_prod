import { User } from "@/types/user";

interface AuthPayload {
  user: User;
}

async function readResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    const message =
      typeof payload?.message === "string" ? payload.message : "No pudimos completar la solicitud.";

    throw new Error(message);
  }

  return payload as T;
}

export const authService = {
  async register(input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<User> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const payload = await readResponse<AuthPayload>(response);

    return payload.user;
  },

  async login(input: { email: string; password: string }): Promise<User> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const payload = await readResponse<AuthPayload>(response);

    return payload.user;
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include"
    });

    const payload = await readResponse<AuthPayload>(response);

    return payload.user;
  },

  async completeOnboarding(input: {
    country: string;
    documentType: "RUT" | "DNI";
    documentNumber: string;
  }): Promise<User> {
    const response = await fetch("/api/me/onboarding", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const payload = await readResponse<AuthPayload>(response);

    return payload.user;
  },

  async logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
  }
};

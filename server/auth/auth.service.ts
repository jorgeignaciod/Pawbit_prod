import { createToken } from "@/server/shared/ids";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createSessionToken, hashSessionToken, SESSION_DURATION_MS } from "@/server/auth/session";
import { sessionRepository } from "@/server/auth/session.repository";
import { LoginInput, OnboardingInput, RegisterInput } from "@/server/auth/auth.schemas";
import { userRepository } from "@/server/users/user.repository";
import { PublicUser, StoredUser, toPublicUser } from "@/server/users/user.types";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80";

function buildUser(input: RegisterInput): StoredUser {
  const timestamp = new Date().toISOString();

  return {
    id: 0,
    token: createToken("user"),
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    country: "",
    city: "",
    documentType: "RUT",
    documentNumber: "",
    avatar: DEFAULT_AVATAR,
    passwordHash: hashPassword(input.password),
    onboardingCompleted: true,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

async function createSession(userId: number) {
  const token = createSessionToken();
  const timestamp = new Date();
  const expiresAt = new Date(timestamp.getTime() + SESSION_DURATION_MS).toISOString();

  await sessionRepository.create({
    id: 0,
    token: createToken("session"),
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
    createdAt: timestamp.toISOString()
  });

  return { token, expiresAt };
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      return {
        ok: false as const,
        status: 409,
        message: "Ya existe una cuenta con ese correo"
      };
    }

    const user = await userRepository.create(buildUser(input));
    const session = await createSession(user.id);

    return {
      ok: true as const,
      status: 201,
      user: toPublicUser(user),
      session
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      return {
        ok: false as const,
        status: 401,
        message: "Correo o contraseña incorrectos"
      };
    }

    const session = await createSession(user.id);

    return {
      ok: true as const,
      status: 200,
      user: toPublicUser(user),
      session
    };
  },

  async getStoredUserBySessionToken(sessionToken?: string | null): Promise<StoredUser | null> {
    if (!sessionToken) {
      return null;
    }

    const session = await sessionRepository.findByTokenHash(hashSessionToken(sessionToken));

    if (!session) {
      return null;
    }

    const user = await userRepository.findById(session.userId);

    return user;
  },

  async getUserBySessionToken(sessionToken?: string | null): Promise<PublicUser | null> {
    const user = await this.getStoredUserBySessionToken(sessionToken);

    return user ? toPublicUser(user) : null;
  },

  async logout(sessionToken?: string | null) {
    if (!sessionToken) {
      return;
    }

    await sessionRepository.deleteByTokenHash(hashSessionToken(sessionToken));
  },

  async completeOnboarding(userId: number, input: OnboardingInput) {
    const updatedUser = await userRepository.update(userId, (user) => ({
      ...user,
      country: input.country,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    }));

    return updatedUser ? toPublicUser(updatedUser) : null;
  }
};

import { prisma } from "@/server/db/prisma";

export interface StoredSession {
  id: number;
  token: string;
  userId: number;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

function mapSession(session: {
  id: number;
  token: string;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}): StoredSession {
  return {
    ...session,
    expiresAt: session.expiresAt.toISOString(),
    createdAt: session.createdAt.toISOString()
  };
}

export const sessionRepository = {
  async create(session: StoredSession) {
    const createdSession = await prisma.session.create({
      data: {
        token: session.token,
        userId: session.userId,
        tokenHash: session.tokenHash,
        expiresAt: new Date(session.expiresAt),
        createdAt: new Date(session.createdAt)
      }
    });

    return mapSession(createdSession);
  },

  async findByTokenHash(tokenHash: string) {
    const session = await prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    return session ? mapSession(session) : null;
  },

  async deleteByTokenHash(tokenHash: string) {
    await prisma.session.deleteMany({
      where: {
        tokenHash
      }
    });
  }
};

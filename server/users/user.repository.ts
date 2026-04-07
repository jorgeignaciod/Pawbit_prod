import { prisma } from "@/server/db/prisma";
import { StoredUser } from "@/server/users/user.types";

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  documentType: "RUT" | "DNI";
  documentNumber: string;
  avatar: string;
  passwordHash: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}): StoredUser {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

export const userRepository = {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return user ? mapUser(user) : null;
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return user ? mapUser(user) : null;
  },

  async create(user: StoredUser) {
    const createdUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        city: user.city,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        avatar: user.avatar,
        passwordHash: user.passwordHash,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
    });

    return mapUser(createdUser);
  },

  async update(userId: string, updater: (user: StoredUser) => StoredUser) {
    const currentUser = await this.findById(userId);

    if (!currentUser) {
      return null;
    }

    const nextUser = updater(currentUser);
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: nextUser.name,
        email: nextUser.email,
        phone: nextUser.phone,
        country: nextUser.country,
        city: nextUser.city,
        documentType: nextUser.documentType,
        documentNumber: nextUser.documentNumber,
        avatar: nextUser.avatar,
        passwordHash: nextUser.passwordHash,
        onboardingCompleted: nextUser.onboardingCompleted,
        updatedAt: new Date(nextUser.updatedAt)
      }
    });

    return mapUser(updatedUser);
  }
};

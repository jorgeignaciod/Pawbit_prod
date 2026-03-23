import { userMock } from "@/mocks/user.mock";
import { delay } from "@/lib/utils";
import { User } from "@/types/user";

export const authService = {
  async loginWithProvider(provider: "google" | "apple"): Promise<User> {
    await delay(700);
    return {
      ...userMock,
      email: provider === "google" ? userMock.email : "jorge@icloud.com"
    };
  },
  async getCurrentUser(): Promise<User> {
    await delay(400);
    return userMock;
  }
};

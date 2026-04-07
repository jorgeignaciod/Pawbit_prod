import { delay } from "@/lib/utils";

export const notificationsService = {
  async getNotifications() {
    await delay(350);
    return [];
  }
};

import { calendarEventsMock } from "@/mocks/calendar-events.mock";
import { delay } from "@/lib/utils";

export const calendarService = {
  async getEvents() {
    await delay(500);
    return [];
  }
};

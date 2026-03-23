import { healthRecordsMock } from "@/mocks/health-records.mock";
import { delay } from "@/lib/utils";

export const recordsService = {
  async getRecordsByPetId(petId: string) {
    await delay(450);
    return healthRecordsMock
      .filter((record) => record.petId === petId)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
};

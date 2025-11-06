import apiService from "./api.service";
import { GymClass } from "@/types";

export type ClassEnrollItem = {
  name: string;
  enrollCount: number;
  sede: {
    id: number;
    name: string;
  };
};

class ClassService {
  private readonly apiService = apiService;

  async getEnrollmentsCount(
    upcoming = true,
    sedeId?: number
  ): Promise<ClassEnrollItem[]> {
    let qs = upcoming ? "?upcoming=true" : "";
    if (sedeId !== undefined) {
      qs += upcoming ? `&sedeId=${sedeId}` : `?sedeId=${sedeId}`;
    }

    const data = await this.apiService.get(`/classes/enrollments-count${qs}`);
    return (data.items ?? []) as ClassEnrollItem[];
  }
}

export default new ClassService();

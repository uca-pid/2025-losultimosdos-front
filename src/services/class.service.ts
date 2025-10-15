import apiService from "./api.service";
import { GymClass } from "@/types";

export type ClassEnrollItem = { name: string; enrollCount: number };

class ClassService {

  private readonly apiService = apiService;

  async getEnrollmentsCount(upcoming = true): Promise<ClassEnrollItem[]> {
    const qs = upcoming ? "?upcoming=true" : "";
    const data = await this.apiService.get(`/classes/enrollments-count${qs}`);
    return (data.items ?? []) as ClassEnrollItem[];
  }
}

export default new ClassService();

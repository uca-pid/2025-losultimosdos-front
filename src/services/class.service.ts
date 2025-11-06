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

  async getAllClasses(sedeId: number): Promise<GymClass[]> {
    const data = await this.apiService.get(`/classes?sedeId=${sedeId}`);
    return data.items as GymClass[];
  }

  async getEnrollmentsCount(
    upcoming = true,
    sedeId: number
  ): Promise<ClassEnrollItem[]> {
    const data = await this.apiService.get(
      `/classes/enrollments-count?upcoming=true&sedeId=${sedeId}`
    );
    return (data.items ?? []) as ClassEnrollItem[];
  }
}

export default new ClassService();

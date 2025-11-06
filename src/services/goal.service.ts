import apiService from "./api.service";
import { Goal } from "@/types";

export interface CreateGoalDto {
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  endDate: Date;
  sedeId: number;
  targetClassId?: number;
  targetRoutineId?: number;
}

export interface UpdateGoalDto {
  title?: string;
  description?: string;
  targetValue?: number;
  endDate?: Date;
  targetClassId?: number;
  targetRoutineId?: number;
}

class GoalService {
  async getGoalsBySede(sedeId: number, token?: string): Promise<Goal[]> {
    const response = await apiService.get(
      `/admin/goals?sedeId=${sedeId}`,
      token
    );
    console.log("response", response);
    return response.goals as Goal[];
  }

  async getGoalById(id: number, token?: string): Promise<Goal> {
    const response = await apiService.get(`/admin/goals/${id}`, token);
    return response.goal;
  }

  async createGoal(goalData: CreateGoalDto, token: string): Promise<Goal> {
    const response = await apiService.post<Goal>(
      "/admin/goals",
      goalData as unknown as Record<string, unknown>,
      token
    );
    return response;
  }

  async updateGoal(
    id: number,
    goalData: UpdateGoalDto,
    token: string
  ): Promise<Goal> {
    const response = await apiService.put<Goal>(
      `/admin/goals/${id}`,
      goalData as unknown as Record<string, unknown>,
      token
    );
    return response;
  }

  async deleteGoal(id: number, token: string): Promise<void> {
    await apiService.delete(`/admin/goals/${id}`, token);
  }
}

const goalService = new GoalService();
export default goalService;

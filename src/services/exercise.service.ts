import apiService from "./api.service";
import { Exercise } from "@/types";

class ExerciseService {
  private readonly apiService = apiService;
  async createExercise(exercise: Omit<Exercise, "id">, token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }
    await this.apiService.post("/admin/exercises", exercise, token);
    return true;
  }
  async updateExercise(
    exerciseId: number,
    exercise: Omit<Exercise, "id">,
    token: string | null
  ) {
    if (!token) {
      throw new Error("No authentication token available");
    }
    await this.apiService.put(
      `/admin/exercises/${exerciseId}`,
      exercise,
      token
    );
    return true;
  }
  async deleteExercise(exerciseId: number, token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }
    await this.apiService.delete(`/admin/exercises/${exerciseId}`, token);
    return true;
  }
  async getAllExercises() {
    const data = await this.apiService.get("/exercises");
    return data.items as Exercise[];
  }
}

export default new ExerciseService();

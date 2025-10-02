import { Routine, RoutineExercise } from "@/types";
import apiService from "./api.service";

class RoutineService {
  private readonly apiService = apiService;
  async getAllRoutines() {
    const data = await this.apiService.get("/routines");
    return data.items as Routine[];
  }

  async createRoutine(
    routine: Omit<Routine, "id">,
    exercises: RoutineExercise[],
    token: string | null
  ) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const transformedExercises = exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      restTime: exercise.restTime,
    }));

    console.log("transformedExercises", transformedExercises);

    const data = await this.apiService.post(
      "/admin/routines",
      { ...routine, exercises: transformedExercises },
      token
    );
    return data as Routine;
  }

  async getRoutine(id: number, token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }
    const data = await this.apiService.get(`/admin/routines/${id}`, token);
    return data as Routine & { exercises: RoutineExercise[] };
  }

  async deleteRoutine(id: number, token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    await this.apiService.delete(`/admin/routines/${id}`, token);
  }

  async updateRoutine(
    id: number,
    routine: Routine,
    exercises: RoutineExercise[],
    token: string | null
  ) {
    if (!token) {
      throw new Error("No authentication token available");
    }
    const transformedExercises = this.transformExercises(exercises);
    await this.apiService.put(
      `/admin/routines/${id}`,
      { ...routine, exercises: transformedExercises },
      token
    );
  }

  private transformExercises(exercises: RoutineExercise[]) {
    return exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      restTime: exercise.restTime,
    }));
  }
}

export default new RoutineService();

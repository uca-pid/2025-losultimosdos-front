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
}

export default new RoutineService();

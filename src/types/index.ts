export interface GymClass {
  id: number;
  name: string;
  description: string;
  date: Date;
  time: string;
  capacity: number;
  enrolled: number;
  createdById: string;
  users: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  createdAt: string;
  role: "admin" | "user";
}

export interface Routine {
  id: number;
  name: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  icon: string;
}

export interface MuscleGroup {
  id: number;
  name: string;
}
export interface Exercise {
  id: number;
  name: string;
  equipment?: string | null;
  videoUrl?: string | null;
  muscleGroupId: number;
  muscleGroup: MuscleGroup;
}

export interface RoutineExercise {
  id: number;
  routineId: number;
  exerciseId: number;
  sets?: number;
  reps?: number;
  restTime?: number; // in seconds
}

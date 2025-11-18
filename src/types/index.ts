export interface GymClass {
  id: number;
  name: string;
  description: string;
  date: Date;
  time: string;
  capacity: number;
  enrolled: number;
  sedeId: number;
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
  role: "admin" | "user" | "medibook";
  plan: "basic" | "premium";
  sedeId: number;
}

export interface ApiKey {
  id: string;
  key: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface Routine {
  id: number;
  name: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  icon: string;
  users: string[];
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

export interface Sede {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type GoalCategory =
  | "CLASS_ENROLLMENTS"
  | "ROUTINE_ASSIGNMENTS"
  | "USER_REGISTRATIONS";

export interface Goal {
  id: number;
  title: string;
  description?: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date;
  sedeId: number;
  targetClassId?: number;
  targetClass?: GymClass;
  targetRoutineId?: number;
  targetRoutine?: Routine;
  createdAt: Date;
  updatedAt: Date;
}

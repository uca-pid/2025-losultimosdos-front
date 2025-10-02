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
  durationWeeks: number;
  icon: string;
}
export interface Exercise {
  id: number;
  description: string;
  name: string;
  videoUrl: string;
  muscleGroup: string;
  muscleGroupID:number;
  equipment: string;
}

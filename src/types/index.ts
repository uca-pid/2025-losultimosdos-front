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

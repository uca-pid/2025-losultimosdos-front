export interface GymClass {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  capacity: number;
  enrolledStudents: number;
  instructor: string;
  status: "upcoming" | "in-progress" | "completed";
}

export const mockClasses: GymClass[] = [
  {
    id: "1",
    name: "Morning Yoga",
    description: "Start your day with energizing yoga poses",
    date: "2025-09-17",
    time: "07:00",
    capacity: 20,
    enrolledStudents: 15,
    instructor: "Sarah Johnson",
    status: "upcoming",
  },
  {
    id: "2",
    name: "HIIT Training",
    description: "High-intensity interval training for maximum results",
    date: "2025-09-17",
    time: "09:00",
    capacity: 15,
    enrolledStudents: 10,
    instructor: "Mike Thompson",
    status: "upcoming",
  },
  {
    id: "3",
    name: "Pilates Fundamentals",
    description: "Core strengthening and flexibility training",
    date: "2025-09-18",
    time: "08:00",
    capacity: 12,
    enrolledStudents: 8,
    instructor: "Emma Davis",
    status: "upcoming",
  },
  {
    id: "4",
    name: "Spinning Class",
    description: "High-energy indoor cycling session",
    date: "2025-09-18",
    time: "17:00",
    capacity: 25,
    enrolledStudents: 20,
    instructor: "John Smith",
    status: "upcoming",
  },
  {
    id: "5",
    name: "CrossFit Basics",
    description: "Introduction to CrossFit movements and techniques",
    date: "2025-09-19",
    time: "10:00",
    capacity: 15,
    enrolledStudents: 12,
    instructor: "Alex Martinez",
    status: "upcoming",
  },
];

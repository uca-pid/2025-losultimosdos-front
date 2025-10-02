import CreateExercise from "@/components/exercises/create-exercise";
import AdminTable from "@/components/exercises/admin-table";
import apiService from "@/services/api.service";
import { Exercise } from "@/types";

const AdminPage = async () => {
  const response = (await apiService.get("/exercises")) as {
    exercises: Exercise[];
  };
  const exercises = response.exercises;
  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Ejercicios Disponibles</h1>
        <CreateExercise />
      </div>
      <AdminTable
        exercises={exercises.sort((a, b) => a.name.localeCompare(b.name)) || []}
      />
    </div>
  );
};

export default AdminPage;

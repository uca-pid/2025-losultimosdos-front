"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import TableSkeleton from "@/components/skeletons/table-skeleton";

import CreateExercise from "@/components/exercises/create-exercise";
import AdminTable from "@/components/exercises/admin-table";
import exerciseService from "@/services/exercise.service";

const AdminPage = () => {
  const { data: exercises, isLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const exercises = await exerciseService.getAllExercises();
      return exercises;
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!exercises) {
    return <DataTable data={[]} columns={[]} />;
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Ejercicios Disponibles</h1>
        <CreateExercise />
      </div>
      <AdminTable
        exercises={
          exercises?.sort((a, b) => a.name.localeCompare(b.name)) || []
        }
      />
    </div>
  );
};

export default AdminPage;

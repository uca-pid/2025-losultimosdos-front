"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import RoutineService from "@/services/routine.service";
import AdminRoutineTable from "@/components/routines/admin-table";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import TableSkeleton from "@/components/skeletons/table-skeleton";

const RoutinesPage = () => {
  const { data: routines, isLoading } = useQuery({
    queryKey: ["routines"],
    queryFn: async () => {
      const routines = await RoutineService.getAllRoutines();
      return routines;
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!routines) {
    return <DataTable data={[]} columns={[]} />;
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Rutinas Disponibles</h1>

        <Link href="/admin/routines/new">
          <Button variant="outline">Crear Rutina</Button>
        </Link>
      </div>

      <AdminRoutineTable routines={routines} />
    </div>
  );
};

export default RoutinesPage;

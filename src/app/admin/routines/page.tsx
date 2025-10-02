import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/routines/columns";
import RoutineService from "@/services/routine.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RoutinesPage = async () => {
  const routines = await RoutineService.getAllRoutines();
  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Rutinas Disponibles</h1>

        <Link href="/admin/routines/new">
          <Button variant="outline">Crear Rutina</Button>
        </Link>
      </div>

      <DataTable columns={columns} data={routines} />
    </div>
  );
};

export default RoutinesPage;

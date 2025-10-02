"use client";

import { DataTable } from "@/components/ui/data-table";
import { type Exercise } from "@/types";
import { columns } from "@/components/exercises/columns";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import apiService from "@/services/api.service";
import { Button } from "../ui/button";
import { ExerciseForm } from "../forms/exercise";
import type { ExerciseFormValues } from "../forms/exercise";

interface AdminTableProps {
  exercises: Exercise[];
}

const AdminTable = ({ exercises }: AdminTableProps) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { getToken } = useAuth();
  const router = useRouter();

  const onDelete = async (id: number) => {
    setDeletingId(id);
    const token = await getToken();
    if (!token) return;
    await apiService.delete(`/admin/exercises/${id}`, token);
    router.refresh();
    setDeletingId(null);
  };

  // ⬇️ ahora el handler espera el payload del form
  const onEdit = async (values: ExerciseFormValues) => {
    const token = await getToken();
    if (!token || !values.id) return;

    await apiService.put(
      `/admin/exercises/${values.id}`,
      {
        name: values.name,
        videoUrl: values.videoUrl || null,
        equipment: values.equipment || null,
        muscleGroupId: values.muscleGroupId,
      },
      token
    );

    router.refresh();
    setSelectedExercise(null);
  };

  const adminColumns: ColumnDef<Exercise>[] = [
    ...columns,
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="px-4 py-2 flex gap-2 items-center justify-end">
          <Sheet
            open={selectedExercise?.id === row.original.id}
            onOpenChange={(open) => !open && setSelectedExercise(null)}
          >
            <SheetTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setSelectedExercise(row.original)}
              >
                Editar
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[90%] sm:w-[540px]" side="right">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">
                  Editar Ejercicio
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <ExerciseForm
                  defaultValues={{
                    id: row.original.id,
                    name: row.original.name,
                    videoUrl: row.original.videoUrl ?? "",
                    equipment: row.original.equipment ?? "",
                    muscleGroupId: row.original.muscleGroup.id,
                  }}
                  onSubmit={onEdit}
                  isEdit
                />
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="destructive"
            onClick={async () => {
              await onDelete(row.original.id);
            }}
            disabled={deletingId === row.original.id}
          >
            {deletingId === row.original.id ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={adminColumns} data={exercises} />;
};

export default AdminTable;

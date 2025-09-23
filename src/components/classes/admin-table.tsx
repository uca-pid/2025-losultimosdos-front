"use client";

import { DataTable } from "@/components/ui/data-table";
import { type GymClass } from "@/types";
import { columns } from "@/components/classes/columns";
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
import { ClassForm } from "../forms/class";

interface AdminTableProps {
  classes: GymClass[];
}

const AdminTable = ({ classes }: AdminTableProps) => {
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  const onDelete = async (id: number) => {
    setIsDeleting(true);
    const token = await getToken();
    if (!token) return;
    await apiService.delete(`/admin/class/${id}`, token!);
    router.refresh();
    setIsDeleting(false);
  };

  const onEdit = async (values: GymClass) => {
    const token = await getToken();
    if (!token) return;
    await apiService.put(`/admin/class/${values.id}`, { ...values }, token!);
    router.refresh();
  };

  const adminColumns: ColumnDef<GymClass>[] = [
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="px-4 py-2 flex gap-2 items-center justify-end">
          <SheetTrigger onClick={() => setSelectedClass(row.original)} asChild>
            <Button variant="outline">Editar</Button>
          </SheetTrigger>
          <Button
            variant="destructive"
            onClick={async () => {
              await onDelete(row.original.id);
            }}
            disabled={isDeleting}
            className="cursor-pointer disabled:cursor-not-allowed w-24 "
          >
            {isDeleting ? "Eliminando" : "Eliminar"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Sheet>
      <DataTable
        columns={columns}
        data={classes}
        extraColumns={adminColumns}
        headerClassName="last:items-center last:justify-end last:w-min last:w-[100px] last:min-w-[100px]"
      />
      <SheetContent className="sm:w-[540px]" side="right">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Editar Clase</SheetTitle>
        </SheetHeader>
        <ClassForm defaultValues={selectedClass!} onSubmit={onEdit} isEdit />
      </SheetContent>
    </Sheet>
  );
};

export default AdminTable;

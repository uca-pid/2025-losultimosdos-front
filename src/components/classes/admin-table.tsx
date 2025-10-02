"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@clerk/nextjs";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";

import apiService from "@/services/api.service";
import { ClassForm } from "@/components/forms/class";
import { type GymClass } from "@/types";
import { columns } from "@/components/classes/columns";

const useIsMobile = (query = "(max-width: 640px)") => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);

    onChange(mql);
    mql.addEventListener?.("change", onChange as any);
    return () => mql.removeEventListener?.("change", onChange as any);
  }, [query]);
  return isMobile;
};

interface AdminTableProps {
  classes: GymClass[];
}

const AdminTable = ({ classes }: AdminTableProps) => {
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isMobile = useIsMobile();
  const { getToken } = useAuth();
  const router = useRouter();

  const onDelete = async (id: number) => {
    try {
      setDeletingId(id);
      const token = await getToken();
      if (!token) return;
      await apiService.delete(`/admin/class/${id}`, token!);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const onEdit = async (values: GymClass) => {
    const token = await getToken();
    if (!token) return;
    await apiService.put(`/admin/class/${values.id}`, { ...values }, token!);
    router.refresh();
    setSelectedClass(null);
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
            disabled={deletingId === row.original.id}
            className="cursor-pointer disabled:cursor-not-allowed w-24"
          >
            {deletingId === row.original.id ? "Eliminando" : "Eliminar"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Sheet
      open={!!selectedClass}
      onOpenChange={(open) => !open && setSelectedClass(null)}
    >
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={classes}
          extraColumns={adminColumns}
          headerClassName="last:items-center last:justify-end last:w-min last:w-[100px] last:min-w-[100px]"
        />
      </div>

      <div className="sm:hidden space-y-3">
        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No hay clases creadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          classes.map((cls) => (
            <Card key={cls.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{cls.name}</CardTitle>
                <CardAction className="mt-2 flex gap-2">
                  <SheetTrigger onClick={() => setSelectedClass(cls)} asChild>
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                  </SheetTrigger>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(cls.id)}
                    disabled={deletingId === cls.id}
                    className="flex-1"
                  >
                    {deletingId === cls.id ? "Eliminando" : "Eliminar"}
                  </Button>
                </CardAction>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Fecha</div>
                  <div className="text-gray-900 dark:text-gray-100 text-right">
                    {cls.date
                      ? new Date(cls.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Hora</div>
                  <div className="text-gray-900 dark:text-gray-100 text-right">
                    {cls.time ?? "-"}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">
                    Capacidad
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 text-right">
                    {typeof cls.capacity === "number" ? cls.capacity : "-"}
                  </div>
                                    <div className="text-gray-500 dark:text-gray-400">
                    Inscriptos
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 text-right">
                    {typeof cls.enrolled === "number" ? cls.enrolled : "-"}
                  </div>
                  

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[90vh] w-full p-4" : "sm:w-[540px]"}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Editar Clase</SheetTitle>
        </SheetHeader>
        {selectedClass && (
          <div className="mt-4">
            <ClassForm defaultValues={selectedClass} onSubmit={onEdit} isEdit />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminTable;

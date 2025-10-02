"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { columns as baseColumns } from "@/components/routines/columns";
import type { Routine } from "@/types";
import {
  Activity,
  Dumbbell,
  Flame,
  Timer,
  Heart,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  dumbbell: Dumbbell,
  flame: Flame,
  timer: Timer,
  heart: Heart,
};

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

interface AdminRoutineTableProps {
  routines: Routine[];
  extraColumns?: ColumnDef<Routine>[];
}

const AdminRoutineTable = ({
  routines,
  extraColumns = [],
}: AdminRoutineTableProps) => {
  const isMobile = useIsMobile();

  const tableColumns: ColumnDef<Routine>[] =
    extraColumns.length > 0 ? [...baseColumns, ...extraColumns] : baseColumns;

  return (
    <>
      <div className="hidden sm:block">
        <DataTable columns={tableColumns} data={routines} />
      </div>

      <div className="sm:hidden space-y-3">
        {routines.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No hay rutinas disponibles.
              </p>
            </CardContent>
          </Card>
        ) : (
          routines.map((rt) => (
            <Card key={rt.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {(() => {
                    const key = (rt.icon ?? "").toString().toLowerCase();
                    const IconCmp = ICONS[key as keyof typeof ICONS];
                    return IconCmp ? (
                      <IconCmp className="h-4 w-4" aria-hidden />
                    ) : null;
                  })()}
                  <span>{rt.name ?? "Rutina sin nombre"}</span>
                </CardTitle>

                <CardAction className="mt-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Link href={`/admin/routines/${rt.id}`} prefetch={false}>
                      Ver / Editar
                    </Link>
                  </Button>
                </CardAction>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">
                    Descripción
                  </div>
                  <div className="text-right text-gray-900 dark:text-gray-100">
                    {rt.description ?? "-"}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Nivel</div>
                  <div className="text-right text-gray-900 dark:text-gray-100">
                    {rt.level ?? "-"}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">
                    Duración
                  </div>
                  <div className="text-right text-gray-900 dark:text-gray-100">
                    {rt.duration ?? "-"}
                  </div>
                </div>

                {rt.description ? (
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 line-clamp-4">
                    {rt.description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default AdminRoutineTable;

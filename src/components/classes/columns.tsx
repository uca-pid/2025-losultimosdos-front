"use client";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { type GymClass } from "@/types";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<GymClass>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre de la clase
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString();
    },
  },
  {
    accessorKey: "time",
    header: "Hora",
  },
  {
    accessorKey: "capacity",
    header: "Capacidad",
  },
  {
    accessorKey: "enrolled",
    header: "Inscritos",
  },
];

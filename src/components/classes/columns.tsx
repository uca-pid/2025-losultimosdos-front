"use client";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { type GymClass } from "@/lib/mock-data";
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
  // {
  //   accessorKey: "instructor",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Profesor/a
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
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
    cell: ({ row }) => {
      return new Date(row.getValue("time")).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacidad",
  },
  {
    accessorKey: "enrolled",
    header: "Inscritos",
  },
  // {
  //   accessorKey: "status",
  //   header: "Estado",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as string;
  //     return (
  //       <span
  //         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
  //           status === "upcoming"
  //             ? "bg-blue-100 text-blue-800"
  //             : status === "in-progress"
  //             ? "bg-green-100 text-green-800"
  //             : "bg-gray-100 text-gray-800"
  //         }`}
  //       >
  //         {status}
  //       </span>
  //     );
  //   },
  // },
];

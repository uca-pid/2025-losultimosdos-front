"use client";

import { Routine } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { ICONS } from "@/components/forms/routine"; // el mapping de arriba

const columns: ColumnDef<Routine>[] = [
  {
    accessorKey: "icon",
    header: "Icono",
    cell: ({ row }) => {
      const name = row.original.icon as string;
      const IconCmp = ICONS[name];
      return IconCmp ? (
        <div className="flex items-center gap-2">
          <IconCmp className="h-4 w-4" />
        </div>
      ) : (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {name ?? "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return <div>{row.original.description}</div>;
    },
  },
  {
    accessorKey: "level",
    header: "Nivel",
    cell: ({ row }) => {
      return <div>{row.original.level}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duración",
    cell: ({ row }) => {
      return <div>{row.original.duration}</div>;
    },
  },
];

export { columns };

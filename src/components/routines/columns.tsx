"use client";

import { Routine } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Routine>[] = [
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
  {
    accessorKey: "icon",
    header: "Icono",
    cell: ({ row }) => {
      return <div>{row.original.icon}</div>;
    },
  },
];

export { columns };

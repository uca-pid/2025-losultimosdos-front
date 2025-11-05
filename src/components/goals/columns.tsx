// components/goals/columns.tsx
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GymGoal } from "@/types";

function getRemainingTime(endDateStr: string) {
  const now = new Date().getTime();
  const end = new Date(endDateStr).getTime();
  const diff = end - now;

  if (diff <= 0) return { days: 0, hours: 0, isExpired: true };

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return { days, hours, isExpired: false };
}

export const goalColumns: ColumnDef<GymGoal>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Meta
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const goal = row.original;
      return (
        <div>
          <div className="font-medium">{goal.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Progreso
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number;
      return (
        <div className="min-w-[160px] space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avance</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "Tiempo restante",
    cell: ({ row }) => {
      const endDate = row.getValue("endDate") as string;
      const { days, hours, isExpired } = getRemainingTime(endDate);

      if (isExpired) {
        return <span className="text-xs text-red-500">Vencida</span>;
      }

      return (
        <span className="text-sm font-mono">
          {days}d {hours}h
        </span>
      );
    },
  },
];

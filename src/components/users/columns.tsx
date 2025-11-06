"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { User } from "@/types";
import { getPlanBadgeColor } from "@/lib/user-utils";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "picture",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-center rounded-lg overflow-hidden w-8 h-8">
        <Avatar className="w-8 h-8 rounded-lg">
          <AvatarImage
            src={row.original.imageUrl}
            alt={row.original.firstName || ""}
          />
          <AvatarFallback className="rounded-lg">
            {row.original.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: ({ row }) => row.original.firstName,
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
    cell: ({ row }) => row.original.lastName,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Badge
          variant="outline"
          className={`${
            row.original.role === "admin" ? "bg-indigo-500" : "bg-gray-500"
          }`}
        >
          {row.original.role.charAt(0).toUpperCase() +
            row.original.role.slice(1)}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Badge
          variant="outline"
          className={getPlanBadgeColor(row.original.plan)}
        >
          {row.original.plan.charAt(0).toUpperCase() +
            row.original.plan.slice(1)}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="px-4 py-2 flex gap-2 items-center justify-end">
        <Button variant="outline" asChild>
          <Link href={`/admin/user/${row.original.id}`}>Ver</Link>
        </Button>
      </div>
    ),
  },
];

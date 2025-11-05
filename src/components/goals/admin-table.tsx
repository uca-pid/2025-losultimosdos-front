// components/goals/admin-table.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import apiService from "@/services/api.service";
import { DataTable } from "@/components/ui/data-table";
import { goalColumns } from "@/components/goals/columns";
import { GymGoal } from "@/types";

interface GoalsAdminTableProps {
  goals: GymGoal[];
}

const GoalsAdminTable = ({ goals }: GoalsAdminTableProps) => {
  const router = useRouter();
  const { getToken } = useAuth();

  const handleDelete = async (id: number) => {
    const token = await getToken();
    if (!token) throw new Error("No auth token");
    await apiService.delete(`/admin/goals/${id}`, token);
    router.refresh();
  };

  const handleEdit = (id: number) => {
    // TODO: reusar la sheet para editar (por ahora solo log)
    console.log("Editar meta", id);
  };

  return (
    <DataTable
      columns={goalColumns}
      data={goals}
      //handleDelete={handleDelete}
      //onEdit={handleEdit}
    />
  );
};

export default GoalsAdminTable;

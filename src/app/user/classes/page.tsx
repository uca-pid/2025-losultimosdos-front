"use client";
import apiService from "@/services/api.service";
import { UsersClassesTable } from "@/components/classes/users-table";
import { GymClass } from "@/types";
import { FullClasses } from "@/components/classes/full-classes";
import { useStore } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/classes/columns";

const UserPage = () => {
  const { selectedSede } = useStore();
  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes", selectedSede.id],
    queryFn: async () => {
      const response = await apiService.get(
        `/classes?sedeId=${selectedSede.id}`
      );
      return response.classes as GymClass[];
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!classes) {
    return <DataTable data={[]} columns={columns} />;
  }
  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Clases Disponibles</h1>
      </div>
      <UsersClassesTable
        classes={classes.filter((c) => c.users.length < c.capacity) || []}
      />
      {classes.filter((c) => c.users.length >= c.capacity).length > 0 && (
        <FullClasses
          fullClasses={
            classes.filter((c) => c.users.length >= c.capacity) || []
          }
        />
      )}
    </div>
  );
};

export default UserPage;

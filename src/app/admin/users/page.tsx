"use client";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/components/users/columns";
import { useUsers } from "@/hooks/use-users";

const UsersPage = () => {
  const { data: users = [], isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold">Usuarios</h1>
        </div>
        <div className="rounded-md border">
          <div className="border-b">
            <div className="grid grid-cols-5 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-[80%]" />
              ))}
            </div>
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b">
                <div className="grid grid-cols-5 p-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-[80%]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto space-y-4 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold">Usuarios</h1>
        </div>
        <div className="flex items-center justify-center p-8 text-red-500">
          <p>Error al cargar usuarios: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Usuarios</h1>
      </div>
      <DataTable
        columns={columns}
        data={users}
        headerClassName="first:w-[80px] first:min-w-[80px] first:justify-center first:items-center"
      />
    </div>
  );
};

export default UsersPage;

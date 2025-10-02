"use client";

import { useParams } from "next/navigation";
import UserDataCard from "@/components/users/user-data-card";
import UserClassesCard from "@/components/users/user-classes-card";
import UserRoutinesCard from "@/components/users/user-routines-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";

const UserInfoPage = () => {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, error, isPending } = useUser(userId);

  if (isLoading || isPending) {
    return (
      <div className="container mx-auto space-y-6 p-4">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-64 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto space-y-4 p-4">
        <div className="flex items-center justify-center p-8 text-red-500">
          <p>Error al cargar usuario: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto space-y-4 p-4">
        <h1 className="text-lg font-bold">Usuario no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">Información del Usuario</h1>

      <div className="grid gap-6">
        <UserDataCard user={user} />
        <UserClassesCard userId={userId} />
        <UserRoutinesCard userId={userId} />
      </div>
    </div>
  );
};

export default UserInfoPage;

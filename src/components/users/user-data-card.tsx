"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ALL_ROLES } from "@/lib/roles";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/user.service";
import { toast } from "react-hot-toast";

interface UserDataCardProps {
  user: User;
}

const useIsMobile = (query = "(max-width: 640px)") => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    onChange(mql);
    mql.addEventListener?.("change", onChange as any);
    return () => mql.removeEventListener?.("change", onChange as any);
  }, [query]);
  return isMobile;
};

const UserDataCard = ({ user }: UserDataCardProps) => {
  const isMobile = useIsMobile();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: async (newRole: string) => {
      const token = await getToken();
      return userService.updateUserRole(user.id, newRole, token!);
    },
    onMutate: async (newRole) => {
      await queryClient.cancelQueries({ queryKey: ["users", user.id] });
      const prevUser = queryClient.getQueryData<User>(["users", user.id]);
      queryClient.setQueryData(["users", user.id], (oldData: User) => {
        return { ...oldData, role: newRole };
      });
      toast.success("Rol actualizado correctamente", { id: "update-role" });
      return { prevUser };
    },
    onError: (_error, _newRole, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(["users", user.id], context.prevUser);
      }
      toast.error("Error al actualizar el rol del usuario", {
        id: "update-role",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    },
  });

  const handleRoleChange = (newRole: string) => {
    if (newRole === user.role) return;
    updateRole(newRole);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-indigo-500 text-white";
      case "user":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Avatar className="w-20 h-20 rounded-lg overflow-hidden">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.firstName || ""}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="rounded-lg bg-gray-200 flex items-center justify-center w-20 h-20 text-xl">
                  {user.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-500">Nombre</div>
              <div className="text-right text-gray-900 dark:text-gray-100">
                {user.firstName || "N/A"}
              </div>

              <div className="text-gray-500">Apellido</div>
              <div className="text-right text-gray-900 dark:text-gray-100">
                {user.lastName || "N/A"}
              </div>

              <div className="text-gray-500">Email</div>
              <div className="text-right text-gray-900 dark:text-gray-100 break-all">
                {user.email || "N/A"}
              </div>

              <div className="text-gray-500">ID</div>
              <div className="text-right text-gray-900 dark:text-gray-100 break-all">
                {user.id}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-gray-500">Rol:</p>
              <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    className="ml-auto"
                  >
                    Cambiar Rol
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Seleccionar nuevo rol</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ALL_ROLES.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      disabled={role === user.role}
                    >
                      <Badge
                        variant="outline"
                        className={`${getRoleBadgeColor(role)} mr-2`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Badge>
                      {role === user.role && "(Actual)"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center justify-center md:justify-start">
              <Avatar className="w-24 h-24 rounded-lg overflow-hidden">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.firstName || ""}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="rounded-lg bg-gray-200 flex items-center justify-center w-24 h-24 text-2xl">
                  {user.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{user.firstName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Apellido</p>
                  <p className="font-medium">{user.lastName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium break-all">{user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID de Usuario</p>
                  <p className="font-medium text-xs break-all">{user.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-gray-500">Rol:</p>
                <Badge
                  variant="outline"
                  className={getRoleBadgeColor(user.role)}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      className="ml-2"
                    >
                      Cambiar Rol
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Seleccionar nuevo rol</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {ALL_ROLES.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        disabled={role === user.role}
                      >
                        <Badge
                          variant="outline"
                          className={`${getRoleBadgeColor(role)} mr-2`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Badge>
                        {role === user.role && "(Actual)"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default UserDataCard;

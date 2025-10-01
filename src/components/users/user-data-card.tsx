"use client";

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

const UserDataCard = ({ user }: UserDataCardProps) => {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: async (newRole: string) => {
      const token = await getToken();

      return userService.updateUserRole(user.id, newRole, token!);
    },
    onSuccess: () => {
      queryClient.setQueryData(["users", user.id], (oldData: User) => {
        return {
          ...oldData,
          role: user.role === "admin" ? "user" : "admin",
        };
      });
      toast.success("Rol actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
      toast.error("Error al actualizar el rol del usuario");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="font-medium">{user.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID de Usuario</p>
                <p className="font-medium text-xs">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
      </CardContent>
    </Card>
  );
};

export default UserDataCard;

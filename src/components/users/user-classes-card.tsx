"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import apiService from "@/services/api.service";
import { GymClass } from "@/types";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UserClassesCardProps {
  userId: string;
}

const UserClassesCard = ({ userId }: UserClassesCardProps) => {
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user classes
  const { data: userClasses = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ["userClasses", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiService.get(
        `/admin/users/${userId}/classes`,
        token!
      );
      return response.classes || [];
    },
  });

  // Fetch available classes
  const { data: availableClasses = [], isLoading: isLoadingAvailable } =
    useQuery({
      queryKey: ["availableClasses"],
      queryFn: async () => {
        const token = await getToken();

        const response = await apiService.get("/classes", token!);
        return response.classes || [];
      },
      enabled: open, // Only fetch when dialog is open
    });

  // Assign class mutation
  const { mutate: assignClass, isPending: isAssigning } = useMutation({
    mutationFn: async (classItem: GymClass) => {
      const token = await getToken();

      const response = await apiService.post<{ class: GymClass }>(
        `/admin/class/${classItem.id}/enroll`,
        { userId },
        token!
      );
      return response.class;
    },
    onSuccess: (classItem: GymClass) => {
      queryClient.setQueryData(
        ["userClasses", userId],
        (oldData: GymClass[]) => {
          return [...oldData, classItem];
        }
      );
      toast.success("Clase asignada correctamente");
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error assigning class:", error);
      toast.error("Error al asignar la clase");
    },
  });

  const { mutate: unenrollClass, isPending: isUnenrolling } = useMutation({
    mutationFn: async (classItem: GymClass) => {
      const token = await getToken();
      const response = await apiService.post<{ class: GymClass }>(
        `/admin/class/${classItem.id}/unenroll`,
        { userId },
        token!
      );
      return response.class;
    },
    onSuccess: (classItem: GymClass) => {
      queryClient.setQueryData(
        ["userClasses", userId],
        (oldData: GymClass[]) => {
          return oldData.filter((c) => c.id !== classItem.id);
        }
      );
      toast.success("Clase desasignada correctamente");
    },
    onError: (error) => {
      console.error("Error unenrolling class:", error);
      toast.error("Error al desasignar la clase");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clases del Usuario</CardTitle>
        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Asignar Clase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Asignar Clase al Usuario</DialogTitle>
                <DialogDescription>
                  Selecciona una clase para asignar al usuario
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[400px] overflow-y-auto">
                {isLoadingAvailable ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Cargando clases...
                    </p>
                  </div>
                ) : availableClasses.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No hay clases disponibles
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableClasses.map((gymClass: GymClass) => (
                      <div
                        key={gymClass.id}
                        className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {gymClass.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(gymClass.date).toLocaleDateString(
                              "es-ES"
                            )}{" "}
                            - {gymClass.time}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {gymClass.enrolled}/{gymClass.capacity} inscritos
                          </p>
                        </div>
                        <Button
                          onClick={() => assignClass(gymClass)}
                          disabled={
                            isAssigning ||
                            gymClass.enrolled >= gymClass.capacity
                          }
                          size="sm"
                        >
                          {gymClass.enrolled >= gymClass.capacity
                            ? "Llena"
                            : "Asignar"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoadingClasses ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Cargando clases del usuario...
              </p>
            </div>
          ) : userClasses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No hay clases registradas para este usuario
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                      Clase
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                      Hora
                    </th>
                    <th className=""></th>
                  </tr>
                </thead>
                <tbody>
                  {userClasses.map((classItem: GymClass) => (
                    <tr
                      key={classItem.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {classItem.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {new Date(classItem.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {classItem.time}
                      </td>
                      <td className="py-3 px-4 flex justify-center items-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => unenrollClass(classItem)}
                          disabled={isUnenrolling}
                        >
                          Cancelar inscripción
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserClassesCard;

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import apiService from "@/services/api.service";
import { GymClass } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AvailableClassesModal from "../classes/available-classes-modal";
import { useUnenrollClass } from "@/hooks/use-class-mutations";

interface UserClassesCardProps {
  userId: string;
}

const UserClassesCard = ({ userId }: UserClassesCardProps) => {
  const { getToken } = useAuth();
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

  const { mutate: unenrollClass, isPending: isUnenrolling } =
    useUnenrollClass(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clases del Usuario</CardTitle>
        <CardAction>
          <AvailableClassesModal userId={userId} />
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
              <Table className="w-full">
                <TableHeader className="border-b dark:border-gray-700">
                  <TableRow>
                    <TableHead className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                      Clase
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                      Fecha
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                      Hora
                    </TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userClasses.map((classItem: GymClass) => (
                    <TableRow
                      key={classItem.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {classItem.name}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {new Date(classItem.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {classItem.time}
                      </TableCell>
                      <TableCell className="py-3 px-4 flex justify-center items-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => unenrollClass(classItem)}
                          disabled={isUnenrolling}
                        >
                          Cancelar inscripción
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserClassesCard;

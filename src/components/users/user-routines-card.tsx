"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import apiService from "@/services/api.service";
import { Plus } from "lucide-react";

interface UserRoutine {
  id: number;
  name: string;
  category: string;
  exercises: number;
  createdAt: string;
}

const mockUserRoutines: UserRoutine[] = [
  { id: 1, name: "Rutina de Fuerza", category: "Hipertrofia", exercises: 8, createdAt: "2025-09-25" },
  { id: 2, name: "Cardio Intenso", category: "Cardio", exercises: 5, createdAt: "2025-09-20" },
  { id: 3, name: "Rutina Full Body", category: "General", exercises: 12, createdAt: "2025-09-15" },
  { id: 4, name: "Pierna y Glúteo", category: "Fuerza", exercises: 10, createdAt: "2025-09-10" },
];

interface UserRoutinesCardProps {
  userId: string;
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

const UserRoutinesCard = ({ userId }: UserRoutinesCardProps) => {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [routineCategory, setRoutineCategory] = useState("");
  const [assigning, setAssigning] = useState(false);
  const { getToken } = useAuth();

  const handleAssignRoutine = async () => {
    if (!routineName.trim()) return;

    setAssigning(true);
    try {
      const token = await getToken();
      if (!token) return;

      await apiService.post(
        `/admin/users/${userId}/routines`,
        { name: routineName, category: routineCategory || "General" },
        token
      );

      setRoutineName("");
      setRoutineCategory("");
      setOpen(false);
    } catch (error) {
      console.error("Error assigning routine:", error);
    } finally {
      setAssigning(false);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hipertrofia":
        return "bg-red-500 text-white";
      case "fuerza":
        return "bg-purple-500 text-white";
      case "cardio":
        return "bg-blue-500 text-white";
      case "general":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rutinas del Usuario</CardTitle>
        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Asignar Rutina
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Asignar Rutina al Usuario</DialogTitle>
                <DialogDescription>
                  Crea y asigna una nueva rutina al usuario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="routine-name">Nombre de la Rutina</Label>
                  <Input
                    id="routine-name"
                    placeholder="Ej: Rutina de Fuerza"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="routine-category">Categoría</Label>
                  <Input
                    id="routine-category"
                    placeholder="Ej: Hipertrofia, Cardio, Fuerza"
                    value={routineCategory}
                    onChange={(e) => setRoutineCategory(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleAssignRoutine} disabled={assigning || !routineName.trim()}>
                  {assigning ? "Asignando..." : "Asignar Rutina"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        {mockUserRoutines.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No hay rutinas registradas para este usuario
          </p>
        ) : isMobile ? (
          // ===== MOBILE: CARDS =====
          <div className="space-y-3">
            {mockUserRoutines.map((rt) => (
              <div
                key={rt.id}
                className="rounded-lg border p-3 text-sm grid grid-cols-2 gap-2"
              >
                <div className="text-gray-500 dark:text-gray-400">Rutina</div>
                <div className="text-right text-gray-900 dark:text-gray-100">
                  {rt.name}
                </div>

                <div className="text-gray-500 dark:text-gray-400">Categoría</div>
                <div className="text-right">
                  <Badge variant="outline" className={getCategoryBadgeColor(rt.category)}>
                    {rt.category}
                  </Badge>
                </div>

                <div className="text-gray-500 dark:text-gray-400">Ejercicios</div>
                <div className="text-right text-gray-900 dark:text-gray-100">
                  {rt.exercises}
                </div>

                <div className="text-gray-500 dark:text-gray-400">Creada</div>
                <div className="text-right text-gray-900 dark:text-gray-100">
                  {new Date(rt.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ===== DESKTOP/TABLET: TABLA =====
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                    Rutina
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                    Categoría
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                    Ejercicios
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500 dark:text-gray-400">
                    Creada
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockUserRoutines.map((routine) => (
                  <tr
                    key={routine.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {routine.name}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getCategoryBadgeColor(routine.category)}>
                        {routine.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {routine.exercises}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(routine.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoutinesCard;

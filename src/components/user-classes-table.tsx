import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import apiService from "@/services/api.service";

interface GymClass {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  capacity: number;
  enrolled: number;
}

function formatTime(time: string) {
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) return time.slice(0, 5);
  const date = new Date(time);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return time;
}

export const UserClassesTable = () => {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const { isSignedIn, isLoaded, getToken } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const res = await apiService.get("/classes", token);
      setClasses(res.classes);
      setLoading(false);
    };
    fetchClasses();
  }, [getToken]);

  useEffect(() => {
    const fetchEnrolled = async () => {
      const token = await getToken();
      if (!token) return;
      const res = await apiService.get("/user/my-classes", token);
      setEnrolledClasses(
        Array.isArray(res.classes)
          ? res.classes
          : res.enrollments
          ? res.enrollments.map((e: any) => e.class)
          : []
      );
    };
    fetchEnrolled();
  }, [getToken]);

  const enrolledIds = enrolledClasses.map((c) => c.id);

  const handleEnroll = async (classId: number) => {
    setEnrolling(classId);
    const token = await getToken();
    try {
      await apiService.post("/user/enroll", { classId }, token);
      const [all, mine] = await Promise.all([
        apiService.get("/classes", token),
        apiService.get("/user/my-classes", token),
      ]);
      setClasses(all.classes);
      setEnrolledClasses(
        Array.isArray(mine.classes)
          ? mine.classes
          : mine.enrollments
          ? mine.enrollments.map((e: any) => e.class)
          : []
      );
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al inscribirse");
    }
    setEnrolling(null);
  };

  if (loading || !isLoaded)
    return <div className="container mx-auto p-4">Cargando clases...</div>;
  if (!isSignedIn)
    return <div className="container mx-auto p-4">Debes iniciar sesión.</div>;

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Clases Disponibles</h1>
      </div>
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Descripción</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hora</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cupo</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {classes.map((clase) => {
              const isEnrolled = enrolledIds.includes(clase.id);
              const isFull = clase.enrolled >= clase.capacity;
              return (
                <tr key={clase.id}>
                  <td className="px-4 py-2">{clase.name}</td>
                  <td className="px-4 py-2">{clase.description}</td>
                  <td className="px-4 py-2">{new Date(clase.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{formatTime(clase.time)}</td>
                  <td className="px-4 py-2">{clase.enrolled}/{clase.capacity}</td>
                  <td className="px-4 py-2">
                    {isEnrolled ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">Inscripto</span>
                    ) : (
                      <Button
                        onClick={() => handleEnroll(clase.id)}
                        disabled={isFull || enrolling === clase.id}
                        className="w-full"
                      >
                        {isFull ? "Cupo lleno" : enrolling === clase.id ? "Inscribiendo..." : "Inscribirse"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="text-md font-bold mb-2">Tus clases inscriptas</h2>
        {enrolledClasses.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">No estás inscripto en ninguna clase.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fecha</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hora</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {enrolledClasses.map((clase) => (
                  <tr key={clase.id}>
                    <td className="px-4 py-2">{clase.name}</td>
                    <td className="px-4 py-2">{new Date(clase.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{formatTime(clase.time)}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="secondary"
                        disabled
                        className="w-full"
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
    </div>
  );
};
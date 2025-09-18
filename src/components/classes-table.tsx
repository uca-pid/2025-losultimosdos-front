import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type GymClass } from "@/lib/mock-data";
import CreateClass from "@/pages/clases/create";
import EditClass from "@/pages/clases/edit";
import { useCallback, useEffect, useState } from "react";
import { columns } from "./classes/columns";
import { DataTable } from "./classes/data-table";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import apiService from "@/services/api.service";

export const ClassesTable = () => {
  const [classes, setClasses] = useState<GymClass[]>();
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const navigate = useNavigate();

  const fetchClasses = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await apiService.get("/classes", token!);
    setClasses(data.classes);
  }, [getToken]);

  useEffect(() => {
    fetchClasses();
  }, [getToken, fetchClasses]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleDelete = async (id: number) => {
    const token = await getToken();
    if (!token) return;
    await apiService.delete("/admin/class/" + id.toString(), token!);
    await fetchClasses();
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-4">Cargando...</div>;
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Clases Disponibles</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Crear Clase</Button>
          </SheetTrigger>
          <SheetContent className="w-[90%] sm:w-[540px]" side="right">
            <CreateClass
              onClassCreated={async () => {
                await fetchClasses();
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
      <Sheet
        open={selectedClass !== null}
        onOpenChange={(open) => !open && setSelectedClass(null)}
      >
        <SheetContent className="w-[90%] sm:w-[540px]" side="right">
          {selectedClass && (
            <EditClass
              classData={selectedClass}
              defaultValues={selectedClass}
              onClassUpdated={async () => {
                await fetchClasses();
                setSelectedClass(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
      <DataTable
        columns={columns}
        data={classes || []}
        handleDelete={handleDelete}
        onEdit={(id) =>
          setSelectedClass(classes?.find((c) => c.id === id) || null)
        }
      />
    </div>
  );
};

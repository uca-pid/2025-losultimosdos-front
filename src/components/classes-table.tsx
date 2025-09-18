import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type GymClass } from "@/lib/mock-data";
import CreateClass from "@/pages/clases/create";
import EditClass from "@/pages/clases/edit";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchClasses = async () => {
      const token = await getToken();
      if (!token) return;
      const data = await apiService.get("/classes", token!);
      setClasses(data.classes);
    };
    fetchClasses();
  }, [getToken]);

  useEffect(() => {
    console.log(selectedClass);
  }, [selectedClass]);

  if (isLoaded && !isSignedIn) {
    return navigate("/login");
  }

  const handleDelete = async (id: number) => {
    const token = await getToken();
    if (!token) return;
    apiService.delete("/admin/class/" + id.toString(), token!);
    setClasses(classes?.filter((c) => c.id !== id));
  };

  const handleEdit = async (id: number) => {
    const token = await getToken();
    if (!token) return;
    const classToEdit = classes?.find((c) => c.id.toString() === id.toString());

    apiService.put(
      "/admin/class/" + id.toString(),
      {
        ...classToEdit,
        id: id.toString(),
      },
      token!
    );

    if (classToEdit) {
      setSelectedClass(classToEdit);
    }
  };

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
              onClassCreated={(newClass) => {
                setClasses([
                  ...(classes || []),
                  {
                    ...newClass,
                    id: (classes?.length || 0) + 1,
                    enrolled: 0,
                    createdById: "TBD",
                    users: [],
                  },
                ]);
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
              onClassUpdated={(updatedClass) => {
                setClasses(
                  classes?.map((c) =>
                    c.id === selectedClass.id
                      ? {
                          ...c,
                          ...updatedClass,
                        }
                      : c
                  ) || []
                );
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
        handleEdit={handleEdit}
      />
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type GymClass } from "@/lib/mock-data";
import CreateClass from "@/pages/clases/create";
import { useEffect, useState } from "react";
import { columns } from "./classes/columns";
import { DataTable } from "./classes/data-table";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import apiService from "@/services/api.service";

export const ClassesTable = () => {
  const [classes, setClasses] = useState<GymClass[]>();
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

  if (isLoaded && !isSignedIn) {
    return navigate("/login");
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
              onClassCreated={(newClass) => {
                setClasses([
                  ...(classes || []),
                  {
                    ...newClass,
                    id: String((classes?.length || 0) + 1),
                    enrolledStudents: 0,
                    instructor: "TBD",
                    status: "upcoming",
                  },
                ]);
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable columns={columns} data={classes || []} />
    </div>
  );
};

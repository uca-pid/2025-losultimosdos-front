import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type GymClass, mockClasses } from "@/lib/mock-data";
import CreateClass from "@/pages/clases/create";
import { useState } from "react";
import { columns } from "./classes/columns";
import { DataTable } from "./classes/data-table";

export const ClassesTable = () => {
  const [classes, setClasses] = useState<GymClass[]>(mockClasses);

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
                  ...classes,
                  {
                    ...newClass,
                    id: String(classes.length + 1),
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

      <DataTable columns={columns} data={classes} />
    </div>
  );
};

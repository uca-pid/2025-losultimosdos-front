"use client";
import { useState } from "react";
import { ClassForm } from "../forms/class";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { type GymClass } from "@/types";
import apiService from "@/services/api.service";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const CreateClassSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  const onCreate = async (values: GymClass) => {
    const token = await getToken();
    if (!token) return;
    await apiService.post(`/admin/class`, { ...values }, token!);
    router.refresh();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Crear Clase
      </Button>
      <SheetContent className="w-[90%] sm:w-[540px]" side="right">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Crear Clase</SheetTitle>
        </SheetHeader>
        <ClassForm onSubmit={onCreate} />
      </SheetContent>
    </Sheet>
  );
};

export default CreateClassSheet;

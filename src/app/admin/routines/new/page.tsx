"use client";

import { RoutineForm } from "@/components/forms/routine";
import RoutineService from "@/services/routine.service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const CreateRoutine = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const onCreate = async (values: any) => {
    const token = await getToken();
    if (!token) return;
    await RoutineService.createRoutine(values, values.exercises, token);
    queryClient.refetchQueries({ queryKey: ["routines"] });
    toast.success("Rutina creada correctamente");
    router.refresh();
    setIsOpen(false);
  };
  return <RoutineForm onSubmit={onCreate} />;
};

export default CreateRoutine;

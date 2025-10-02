"use client";

import { RoutineForm } from "@/components/forms/routine";
import RoutineService from "@/services/routine.service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateRoutine = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const onCreate = async (values: any) => {
    const token = await getToken();
    if (!token) return;
    await RoutineService.createRoutine(values, values.exercises, token);
    router.refresh();
    setIsOpen(false);
  };
  return <RoutineForm onSubmit={onCreate} />;
};

export default CreateRoutine;

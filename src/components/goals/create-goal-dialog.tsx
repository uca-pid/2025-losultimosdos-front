"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { GoalForm } from "../forms/goal";
import { GoalFormValues } from "@/schema/goalForm";
import { useCreateGoal } from "@/hooks/use-goal-mutations";
import { useStore } from "@/store/useStore";

export const CreateGoalDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { selectedSede } = useStore();
  const createGoalMutation = useCreateGoal(selectedSede.id, () => {
    setOpen(false);
  });

  const handleSubmit = async (values: GoalFormValues) => {
    await createGoalMutation.mutateAsync({
      title: values.title,
      description: values.description,
      category: values.category,
      targetValue: values.targetValue,
      endDate: values.endDate,
      sedeId: selectedSede.id,
      targetClassId: values.targetClassId,
      targetRoutineId: values.targetRoutineId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Crear nueva meta">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Meta</DialogTitle>
          <DialogDescription>
            Establece una meta para tu sede. Define el objetivo y la fecha
            límite.
          </DialogDescription>
        </DialogHeader>
        <GoalForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

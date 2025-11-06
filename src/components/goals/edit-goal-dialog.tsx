"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { GoalForm } from "../forms/goal";
import { GoalFormValues } from "@/schema/goalForm";
import { useUpdateGoal } from "@/hooks/use-goal-mutations";
import { useStore } from "@/store/useStore";
import { Goal } from "@/types";

interface EditGoalDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditGoalDialog: React.FC<EditGoalDialogProps> = ({
  goal,
  open,
  onOpenChange,
}) => {
  const { selectedSede } = useStore();
  const updateGoalMutation = useUpdateGoal(selectedSede.id, () => {
    onOpenChange(false);
  });

  const handleSubmit = async (values: GoalFormValues) => {
    if (!goal) return;

    await updateGoalMutation.mutateAsync({
      id: goal.id,
      data: {
        title: values.title,
        description: values.description ?? undefined,
        targetValue: values.targetValue,
        endDate: values.endDate,
        targetClassId: values.targetClassId ?? undefined,
        targetRoutineId: values.targetRoutineId ?? undefined,
      },
    });
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogDescription>
            Actualiza los detalles de tu meta.
          </DialogDescription>
        </DialogHeader>
        <GoalForm
          key={goal.id}
          onSubmit={handleSubmit}
          defaultValues={{
            id: goal.id,
            title: goal.title,
            description: goal.description,
            category: goal.category,
            targetValue: goal.targetValue,
            endDate: new Date(goal.endDate),
            sedeId: goal.sedeId,
            targetClassId: goal.targetClassId,
            targetRoutineId: goal.targetRoutineId,
          }}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
};

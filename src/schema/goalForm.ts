import * as z from "zod";

export const goalFormSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().optional().nullable(),
    category: z.enum([
      "CLASS_ENROLLMENTS",
      "ROUTINE_ASSIGNMENTS",
      "USER_REGISTRATIONS",
    ]),
    targetValue: z
      .number()
      .min(1, "El objetivo debe ser al menos 1")
      .max(10000, "El objetivo no puede ser mayor a 10,000"),
    endDate: z.date().refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      },
      { message: "La fecha debe ser futura" }
    ),
    sedeId: z.number(),
    targetClassId: z.union([z.number(), z.null()]).optional(),
    targetRoutineId: z.union([z.number(), z.null()]).optional(),
  })
  .refine(
    (data) => {
      // If category is CLASS_ENROLLMENTS, targetClassId should be set
      if (data.category === "CLASS_ENROLLMENTS" && !data.targetClassId) {
        return false;
      }
      // If category is ROUTINE_ASSIGNMENTS, targetRoutineId should be set
      if (data.category === "ROUTINE_ASSIGNMENTS" && !data.targetRoutineId) {
        return false;
      }
      return true;
    },
    {
      message:
        "Debes seleccionar una clase o rutina específica para esta categoría",
      path: ["targetClassId"],
    }
  );

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    CLASS_ENROLLMENTS: "Inscripciones en clases",
    ROUTINE_ASSIGNMENTS: "Rutinas asignadas",
    USER_REGISTRATIONS: "Usuarios registrados",
  };
  return labels[category] || category;
};

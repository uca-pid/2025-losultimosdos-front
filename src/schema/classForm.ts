import z from "zod";

export const classFormSchema = z.object({
  name: z.string().min(3, "Class name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Date must be in the future"),
  time: z.string(),
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .max(50, "Maximum capacity is 50"),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;
export type ClassFormSchema = typeof classFormSchema;

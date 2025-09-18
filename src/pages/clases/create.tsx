import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import apiService from "@/services/api.service";

// Define the form schema with Zod
const classFormSchema = z.object({
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

type ClassFormValues = z.infer<typeof classFormSchema>;

interface CreateClassProps {
  onClassCreated?: (newClass: ClassFormValues) => void;
}

export default function CreateClass({ onClassCreated }: CreateClassProps) {
  const { getToken } = useAuth();
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      time: "",
      capacity: 10,
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    const createClass = async () => {
      const token = await getToken();
      if (!token) return;
      await apiService.post("/admin/class", data, token!);
      onClassCreated?.(data);
      form.reset();
    };
    createClass();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Crear nueva clase</h1>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la clase</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="e.g., Morning Yoga"
              className="w-full"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Decripcion</Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="Describe the class..."
              className="w-full"
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                className="w-full"
              />
              {form.formState.errors.date && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                {...form.register("time")}
                className="w-full"
              />
              {form.formState.errors.time && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidad</Label>
            <Input
              id="capacity"
              type="number"
              {...form.register("capacity", { valueAsNumber: true })}
              className="w-full"
              min={1}
              max={50}
            />
            {form.formState.errors.capacity && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.capacity.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Crear clase
          </Button>
        </form>
      </Card>
    </div>
  );
}

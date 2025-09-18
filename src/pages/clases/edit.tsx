import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import apiService from "@/services/api.service";
import { type GymClass } from "@/lib/mock-data";
import { classFormSchema, type ClassFormValues } from "@/schema/classForm";

// Define the form schema with Zod

interface EditClassProps {
  classData: GymClass;
  defaultValues: ClassFormValues;
  onClassUpdated?: (updatedClass: ClassFormValues) => void;
}

export default function EditClass({
  classData,
  onClassUpdated,
  defaultValues,
}: EditClassProps) {
  const { getToken } = useAuth();
  // Format the date from ISO to YYYY-MM-DD
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toISOString().split("T")[0];
  };

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      ...defaultValues,
      date: formatDate(defaultValues.date),
    },
  });

  console.log("defaultValues", defaultValues);

  const onSubmit = async (data: ClassFormValues) => {
    const updateClass = async () => {
      const token = await getToken();
      if (!token) return;
      await apiService.put(`/admin/class/${classData.id}`, data, token!);
      onClassUpdated?.(data);
      form.reset();
    };

    updateClass();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Editar clase</h1>

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
            Guardar cambios
          </Button>
        </form>
      </Card>
    </div>
  );
}

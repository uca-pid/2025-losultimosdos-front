"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "react-hot-toast";
import { useState } from "react";

// Schema definition moved outside component for better reusability
const classFormSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripcion debe tener al menos 10 caracteres"),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "La fecha tiene que ser en el futuro"),
  time: z.string(),
  capacity: z
    .number("La capacidad debe ser un número")
    .min(1, "La capacidad debe ser al menos 1")
    .max(50, "La capacidad no puede ser mayor a 50"),
  enrolled: z.number(),
  createdById: z.string(),
  users: z.array(z.string()),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  onSubmit: (values: ClassFormValues) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: ClassFormValues;
  isEdit?: boolean;
}

export const ClassForm = ({
  onSubmit,
  defaultValues,
  isEdit = false,
}: ClassFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      id: defaultValues?.id || 0,
      name: defaultValues?.name || "",
      enrolled: defaultValues?.enrolled || 0,
      createdById: defaultValues?.createdById || "",
      users: defaultValues?.users || [],
      description: defaultValues?.description || "",
      date: defaultValues?.date
        ? new Date(defaultValues.date).toISOString().split("T")[0]
        : "",
      time: defaultValues?.time || "",
      capacity: defaultValues?.capacity || 1,
    },
  });

  const handleSubmit = async (values: ClassFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(values);
      toast.success(
        isEdit ? "Clase editada correctamente" : "Clase creada correctamente"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        isEdit ? "Error al editar la clase" : "Error al crear la clase"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <Card className="max-w-2xl mx-auto p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la clase</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ejemplo: Yoga, Pilates, Spinning..."
                      {...field}
                      aria-label="Nombre de la clase"
                    />
                  </FormControl>
                  {!form.formState.errors.name && (
                    <FormDescription>
                      Ingresa un nombre descriptivo para tu clase
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción de la clase"
                      {...field}
                      aria-label="Descripción de la clase"
                    />
                  </FormControl>
                  {!form.formState.errors.description && (
                    <FormDescription>
                      Describe los detalles y objetivos de la clase
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        aria-label="Fecha de la clase"
                      />
                    </FormControl>
                    {!form.formState.errors.date && (
                      <FormDescription>
                        Selecciona la fecha de la clase
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        aria-label="Hora de la clase"
                      />
                    </FormControl>
                    {!form.formState.errors.time && (
                      <FormDescription>
                        Selecciona la hora de inicio
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      {...field}
                      value={field.value || ""}
                      onChange={(event) => {
                        const value = event.target.value
                          ? parseInt(event.target.value, 10)
                          : "";
                        field.onChange(value);
                      }}
                      aria-label="Capacidad de la clase"
                    />
                  </FormControl>
                  {!form.formState.errors.capacity && (
                    <FormDescription>
                      Número máximo de participantes (1-50)
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className="w-full"
              aria-label={isLoading ? "Creando clase..." : "Crear clase"}
            >
              {isLoading
                ? "Creando clase..."
                : isEdit
                ? "Editar clase"
                : "Crear clase"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

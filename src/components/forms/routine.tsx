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
import { ApiValidationError } from "@/services/api.service";


const routineFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripcion debe tener al menos 10 caracteres"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    message: "Nivel inválido",
  }),

  durationWeeks: z
    .number()
    .min(1, "La duracion debe ser al menos 1 semana")
    .max(52, "La duracion no puede ser mayor a 52 semanas"),
  icon: z.string().url("Debe ser una URL válida"),
});
type RoutineFormValues = z.infer<typeof routineFormSchema>;
interface RoutineFormProps {
  onSubmit: (values: RoutineFormValues) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: RoutineFormValues;
  isEdit?: boolean;
}

export const RoutineForm = ({
  onSubmit,
  defaultValues,
  isEdit = false,
}: RoutineFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      level: "Beginner",
      durationWeeks: 4,
      icon: "",
    },
  });
  const handleSubmit = async (values: RoutineFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      toast.success("Rutina guardada con éxito");
      form.reset();
    } catch (error) {
      if (error instanceof ApiValidationError) {
        error.details.forEach((detail) => {
          toast.error(detail.message);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Rutina de fuerza" {...field} />
                </FormControl>
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
                  <Input placeholder="Descripción de la rutina" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Beginner">Principiante</option>
                    <option value="Intermediate">Intermedio</option>
                    <option value="Advanced">Avanzado</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (semanas)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icono (URL)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.ejemplo.com/icono.png"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Guardando..."
              : isEdit
              ? "Guardar Cambios"
              : "Crear Rutina"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

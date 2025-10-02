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
import { useEffect, useState } from "react";
import { ApiValidationError } from "@/services/api.service";
import { RoutineExercises } from "../routines/routine-exercises";
import { Exercise, RoutineExercise } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RoutineExerciseWithData
  extends Omit<RoutineExercise, "id" | "routineId"> {
  exerciseData: Exercise;
}

const routineExerciseSchema = z.object({
  exerciseId: z.number(),
  sets: z.number().min(1, "Debe tener al menos 1 serie").optional(),
  reps: z.number().min(1, "Debe tener al menos 1 repetición").optional(),
  restTime: z.number().min(0, "El descanso no puede ser negativo").optional(),
  exerciseData: z.object({
    id: z.number(),
    name: z.string(),
    equipment: z.string().nullable().optional(),
    videoUrl: z.string().nullable().optional(),
    muscleGroupId: z.number(),
    muscleGroup: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

const routineFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripcion debe tener al menos 10 caracteres"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    message: "Nivel inválido",
  }),
  duration: z
    .number()
    .min(1, "La duracion debe ser al menos 1 semana")
    .max(52, "La duracion no puede ser mayor a 52 semanas"),
  icon: z.string().url("Debe ser una URL válida"),
  exercises: z
    .array(routineExerciseSchema)
    .min(1, "La rutina debe tener al menos un ejercicio"),
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
      duration: 4,
      icon: "",
      exercises: [],
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
    <div className="container mx-auto space-y-4 p-4">
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Principiante</SelectItem>
                        <SelectItem value="Intermediate">Intermedio</SelectItem>
                        <SelectItem value="Advanced">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración (semanas)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
          <FormField
            control={form.control}
            name="exercises"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ejercicios</FormLabel>
                <FormControl>
                  <RoutineExercises
                    value={field.value}
                    onChange={field.onChange}
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
    </div>
  );
};

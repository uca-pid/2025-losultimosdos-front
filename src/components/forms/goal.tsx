"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { ApiValidationError } from "@/services/api.service";
import { useStore } from "@/store/useStore";
import {
  goalFormSchema,
  GoalFormValues,
  getCategoryLabel,
} from "@/schema/goalForm";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import { GymClass, Routine } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import RoutineService from "@/services/routine.service";
import ClassService from "@/services/class.service";

interface GoalFormProps {
  onSubmit: (values: GoalFormValues) => Promise<void>;
  defaultValues?: Partial<GoalFormValues>;
  isEdit?: boolean;
}

const categoryOptions = [
  { value: "CLASS_ENROLLMENTS", label: "Inscripciones en clases" },
  { value: "ROUTINE_ASSIGNMENTS", label: "Rutinas asignadas" },
  { value: "USER_REGISTRATIONS", label: "Usuarios registrados" },
];

export const GoalForm: React.FC<GoalFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedSede } = useStore();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      id: defaultValues?.id,
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "CLASS_ENROLLMENTS",
      targetValue: defaultValues?.targetValue || 1,
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate)
        : undefined,
      sedeId: selectedSede.id,
      targetClassId: defaultValues?.targetClassId ?? undefined,
      targetRoutineId: defaultValues?.targetRoutineId ?? undefined,
    },
  });

  const selectedCategory = form.watch("category");
  const targetClassId = form.watch("targetClassId");
  const targetValue = form.watch("targetValue");

  const { data: classes } = useQuery({
    queryKey: ["classes", selectedSede.id],
    queryFn: async () => {
      const response = await apiService.get(
        `/classes?sedeId=${selectedSede.id}`
      );
      return response.classes as GymClass[];
    },
    enabled: selectedCategory === "CLASS_ENROLLMENTS",
  });

  // Validate targetValue against class capacity
  useEffect(() => {
    if (
      selectedCategory === "CLASS_ENROLLMENTS" &&
      targetClassId &&
      targetValue &&
      classes
    ) {
      const selectedClass = classes.find(
        (classItem) => classItem.id === targetClassId
      );
      if (selectedClass && targetValue > selectedClass.capacity) {
        form.setError("targetValue", {
          type: "manual",
          message: `Capacidad maxima: ${selectedClass.capacity}`,
        });
      } else {
        // Clear the error if validation passes
        if (form.formState.errors.targetValue?.type === "manual") {
          form.clearErrors("targetValue");
        }
      }
    }
  }, [targetClassId, targetValue, selectedCategory, classes, form]);

  useEffect(() => {
    console.log("form.formState.isDirty", form.formState.isDirty);
    console.log("form.formState.errors", form.formState.errors);
  }, [form.formState.isDirty, form.formState.errors]);

  const { data: routines } = useQuery({
    queryKey: ["routines", selectedSede.id],
    queryFn: async () => {
      const routines = await RoutineService.getAllRoutines(selectedSede.id);
      return routines;
    },
    enabled: selectedCategory === "ROUTINE_ASSIGNMENTS",
  });

  const handleSubmit = async (values: GoalFormValues) => {
    try {
      setIsLoading(true);

      // Validate targetValue against class capacity before submitting
      if (
        values.category === "CLASS_ENROLLMENTS" &&
        values.targetClassId &&
        values.targetValue &&
        classes
      ) {
        const selectedClass = classes.find(
          (classItem) => classItem.id === values.targetClassId
        );
        if (selectedClass && values.targetValue > selectedClass.capacity) {
          form.setError("targetValue", {
            type: "manual",
            message: `Capacidad maxima: (${selectedClass.capacity})`,
          });
          setIsLoading(false);
          return;
        }
      }

      // Convert null values to undefined for API submission
      const cleanedValues = {
        ...values,
        targetClassId: values.targetClassId ?? undefined,
        targetRoutineId: values.targetRoutineId ?? undefined,
        description: values.description ?? undefined,
      };
      await onSubmit(cleanedValues);
      // toast.success(
      //   isEdit ? "Meta actualizada correctamente" : "Meta creada correctamente",
      //   { id: "goal-form" }
      // );
    } catch (error) {
      console.error(error);
      if (error instanceof ApiValidationError) {
        toast.error(error.details[0]?.message || "Error de validación", {
          id: "goal-form",
        });
      } else {
        toast.error(
          isEdit ? "Error al actualizar la meta" : "Error al crear la meta",
          { id: "goal-form" }
        );
      }
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la meta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ejemplo: Alcanzar 100 inscripciones"
                      {...field}
                      aria-label="Título de la meta"
                    />
                  </FormControl>
                  {!form.formState.errors.title && (
                    <FormDescription>
                      Ingresa un título descriptivo para tu meta
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
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción de la meta"
                      {...field}
                      value={field.value ?? ""}
                      aria-label="Descripción de la meta"
                    />
                  </FormControl>
                  {!form.formState.errors.description && (
                    <FormDescription>
                      Añade detalles adicionales sobre la meta
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset target selections when category changes
                      form.setValue("targetClassId", undefined, {
                        shouldValidate: false,
                      });
                      form.setValue("targetRoutineId", undefined, {
                        shouldValidate: false,
                      });
                      // Clear validation errors for the unused field
                      form.clearErrors("targetClassId");
                      form.clearErrors("targetRoutineId");
                      form.clearErrors("targetValue");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger aria-label="Categoría de la meta">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!form.formState.errors.category && (
                    <FormDescription>
                      Tipo de meta que deseas establecer
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedCategory === "CLASS_ENROLLMENTS" && (
              <FormField
                control={form.control}
                name="targetClassId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clase específica</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        // Clear targetValue error when class changes to re-validate
                        form.clearErrors("targetValue");
                      }}
                      value={
                        field.value != null ? field.value.toString() : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Seleccionar clase">
                          <SelectValue placeholder="Selecciona una clase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes?.map((classItem) => (
                          <SelectItem
                            key={classItem.id}
                            value={classItem.id.toString()}
                          >
                            {classItem.name} -{" "}
                            {format(new Date(classItem.date), "dd/MM/yyyy", {
                              locale: es,
                            })}{" "}
                            {classItem.time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!form.formState.errors.targetClassId && (
                      <FormDescription>
                        Selecciona la clase que quieres trackear
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedCategory === "ROUTINE_ASSIGNMENTS" && (
              <FormField
                control={form.control}
                name="targetRoutineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rutina específica</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={
                        field.value != null ? field.value.toString() : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Seleccionar rutina">
                          <SelectValue placeholder="Selecciona una rutina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {routines?.map((routine) => (
                          <SelectItem
                            key={routine.id}
                            value={routine.id.toString()}
                          >
                            {routine.name} - {routine.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!form.formState.errors.targetRoutineId && (
                      <FormDescription>
                        Selecciona la rutina que quieres trackear
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => {
                  const selectedClass =
                    selectedCategory === "CLASS_ENROLLMENTS" &&
                    targetClassId &&
                    classes
                      ? classes.find(
                          (classItem) => classItem.id === targetClassId
                        )
                      : null;
                  const maxValue = selectedClass
                    ? selectedClass.capacity
                    : 10000;

                  return (
                    <FormItem>
                      <FormLabel>Objetivo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={maxValue}
                          {...field}
                          value={field.value || ""}
                          onChange={(event) => {
                            const value = event.target.value
                              ? parseInt(event.target.value, 10)
                              : "";
                            field.onChange(value);
                          }}
                          aria-label="Valor objetivo de la meta"
                        />
                      </FormControl>
                      {!form.formState.errors.targetValue && (
                        <FormDescription>
                          {selectedClass
                            ? `Capacidad maxima: ${selectedClass.capacity}`
                            : "Número objetivo"}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha límite</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        className="w-full"
                        placeholder="Fecha límite"
                      />
                    </FormControl>
                    {!form.formState.errors.endDate && (
                      <FormDescription>Fecha de cumplimiento</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={
                isLoading ||
                !form.formState.isDirty ||
                Object.keys(form.formState.errors).length > 0
              }
              className="w-full"
              aria-label={isLoading ? "Guardando..." : "Guardar meta"}
            >
              {isLoading
                ? "Guardando..."
                : isEdit
                ? "Actualizar meta"
                : "Crear meta"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

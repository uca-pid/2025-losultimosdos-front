"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
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
import apiService, { ApiValidationError } from "@/services/api.service";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { CreatableCombobox } from "../creatable-combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeleteIcon, EllipsisIcon, PencilIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import MuscleGroupForm from "./muscle-group";

type MuscleGroup = { id: number; name: string };

const exerciseFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  videoUrl: z.union([z.literal(""), z.string().url("Debe ser una URL válida")]),
  muscleGroupId: z.number().int().positive("Seleccioná un grupo muscular"),
  equipment: z.union([
    z.literal(""),
    z.string().min(3, "El equipo debe tener al menos 3 caracteres"),
  ]),
});

export type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;

interface ExerciseFormProps {
  onSubmit: (values: ExerciseFormValues) => Promise<void>;
  defaultValues?: Partial<ExerciseFormValues>;
  isEdit?: boolean;
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [values, setValues] = useState<MuscleGroup | null>(null);

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiService.get("/admin/muscle-group", token!);
      return response.items as MuscleGroup[];
    },
  });

  const equipmentOptions = ["Mancuernas", "Barra", "Máquina"];

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? "",
      videoUrl: defaultValues?.videoUrl ?? "",
      muscleGroupId: defaultValues?.muscleGroupId,
      equipment: defaultValues?.equipment ?? "",
    },
  });

  const handleSubmit: SubmitHandler<ExerciseFormValues> = async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      toast.success(isEdit ? "Ejercicio actualizado" : "Ejercicio creado");
      if (!isEdit) form.reset();
    } catch (error: any) {
      if (error instanceof ApiValidationError && error.details?.length) {
        error.details.forEach((d: any) => toast.error(d.message));
      } else {
        toast.error(error?.message ?? "Error al guardar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full p-6">
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
                <FormLabel>Nombre del ejercicio</FormLabel>
                <FormControl>
                  <Input placeholder="Press de banca" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del video (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://ejemplo.com/video" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select de grupo muscular */}
          <FormField
            control={form.control}
            name="muscleGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo muscular</FormLabel>
                <FormControl>
                  <Select
                    value={field.value !== undefined ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={groupsLoading || groups?.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          groupsLoading
                            ? "Cargando grupos..."
                            : groups?.length
                            ? "Seleccioná un grupo"
                            : "Sin grupos disponibles"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {groups?.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between"
                        >
                          <SelectItem value={String(g.id)}>{g.name}</SelectItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                              >
                                <EllipsisIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setOpenModal(true);
                                  setValues(g);
                                }}
                              >
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <DeleteIcon className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo necesario (opcional)</FormLabel>
                <FormControl>
                  <Select
                    value={field.value !== undefined ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(val)}
                    disabled={groupsLoading || groups?.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná un equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || groupsLoading || !form.formState.isDirty}
          >
            {isLoading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Ejercicio"
              : "Crear Ejercicio"}
          </Button>
        </form>
      </Form>
      <MuscleGroupForm
        values={values || { id: 0, name: "" }}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Card>
  );
};

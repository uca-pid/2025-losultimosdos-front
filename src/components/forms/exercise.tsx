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

// ====== tipos y schema ======
type MuscleGroup = { id: number; name: string };

const exerciseFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  // permite "" o URL válida
  videoUrl: z.union([z.literal(""), z.string().url("Debe ser una URL válida")]),
  // debe ser number (no string/unknown)
  muscleGroupId: z.number().int().positive("Seleccioná un grupo muscular"),
  // permite "" o string con mínimo 3
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

const MUSCLE_GROUPS_ENDPOINT = "/admin/musclegroups";

// ====== componente ======
export const ExerciseForm: React.FC<ExerciseFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<MuscleGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const { getToken } = useAuth();

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    // IMPORTANTÍSIMO: que los tipos calcen con el schema.
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      videoUrl: defaultValues?.videoUrl ?? "",
      // number | undefined hasta que elijas en el Select
      muscleGroupId: defaultValues?.muscleGroupId,
      equipment: defaultValues?.equipment ?? "",
    },
  });

  // cargar grupos
  useEffect(() => {
    (async () => {
      try {
        setGroupsLoading(true);
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener el token");

        const res = await apiService.get(MUSCLE_GROUPS_ENDPOINT, token);
        const items: MuscleGroup[] = Array.isArray(res) ? res : res?.items ?? [];
        setGroups(items);

        // si estás creando y no hay valor aún, preseleccioná el primero
        const current = form.getValues("muscleGroupId");
        if (!isEdit && !current && items.length > 0) {
          form.setValue("muscleGroupId", items[0].id, { shouldValidate: true });
        }
      } catch (e: any) {
        console.error(e);
        toast.error("No se pudieron cargar los grupos musculares");
      } finally {
        setGroupsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupMap = useMemo(() => {
    const m = new Map<number, string>();
    groups.forEach((g) => m.set(g.id, g.name));
    return m;
  }, [groups]);

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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción del ejercicio" {...field} />
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
                    disabled={groupsLoading || groups.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          groupsLoading
                            ? "Cargando grupos..."
                            : groups.length
                            ? "Seleccioná un grupo"
                            : "Sin grupos disponibles"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                {/* opcional: mostrar el nombre actual debajo */}
                {field.value && (
                  <p className="text-xs text-muted-foreground">
                    Seleccionado: {groupMap.get(Number(field.value))}
                  </p>
                )}
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
                  <Input placeholder="Mancuernas, Barra, Máquina..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={
              isLoading ||
              groupsLoading ||
              groups.length === 0 ||
              form.getValues("muscleGroupId") === undefined
            }
          >
            {isLoading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Ejercicio"
              : "Crear Ejercicio"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

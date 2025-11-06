"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { ApiValidationError } from "@/services/api.service";
import { Sede } from "@/types";
import dynamic from "next/dynamic";

const MapPicker = dynamic<{
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  existingSedes?: Sede[];
}>(() => import("@/components/forms/sede-map-picker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted rounded-md flex items-center justify-center">
      <p className="text-muted-foreground">Cargando mapa...</p>
    </div>
  ),
});

const sedeFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  latitude: z.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
  longitude: z
    .number()
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida"),
});

export type SedeFormValues = z.infer<typeof sedeFormSchema>;

interface SedeFormProps {
  onSubmit: (values: SedeFormValues) => Promise<void>;
  defaultValues?: Partial<SedeFormValues>;
  isEdit?: boolean;
  existingSedes?: Sede[];
}

export const SedeForm: React.FC<SedeFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false,
  existingSedes = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const form = useForm<SedeFormValues>({
    resolver: zodResolver(sedeFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      address: defaultValues?.address ?? "",
      latitude: defaultValues?.latitude ?? -34.6037,
      longitude: defaultValues?.longitude ?? -58.3816,
    },
  });

  const handleSubmit = async (values: SedeFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      toast.success(isEdit ? "Sede actualizada" : "Sede creada");
      if (!isEdit) form.reset();
    } catch (error: any) {
      console.error(error);
      if (error instanceof ApiValidationError && error.details?.length) {
        error.details.forEach((d: any) => toast.error(d.message));
      } else {
        toast.error(error?.message ?? "Error al guardar la sede");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = async (
    lat: number,
    lng: number,
    address?: string
  ) => {
    form.setValue("latitude", lat, { shouldDirty: true });
    form.setValue("longitude", lng, { shouldDirty: true });

    if (address !== undefined) {
      setIsFetchingAddress(false);
      form.setValue("address", address, { shouldDirty: true });
    } else {
      setIsFetchingAddress(true);
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
                <FormLabel>Nombre de la sede</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Sede Central, Sede Norte"
                    {...field}
                    aria-label="Nombre de la sede"
                  />
                </FormControl>
                {!form.formState.errors.name && (
                  <FormDescription>
                    Ingresa un nombre descriptivo para la sede
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      isFetchingAddress
                        ? "Obteniendo dirección..."
                        : "Haz clic en el mapa para seleccionar"
                    }
                    {...field}
                    aria-label="Dirección de la sede"
                    disabled={isFetchingAddress}
                  />
                </FormControl>
                {!form.formState.errors.address && (
                  <FormDescription>
                    Haz clic en el mapa para obtener la dirección
                    automáticamente, o escribe una manualmente
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Ubicación en el mapa</FormLabel>
            <FormDescription>
              Haz clic en el mapa para seleccionar la ubicación exacta
            </FormDescription>
            <MapPicker
              latitude={form.watch("latitude")}
              longitude={form.watch("longitude")}
              onLocationChange={handleLocationChange}
              existingSedes={existingSedes}
            />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">
                      Latitud
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        aria-label="Latitud"
                        className="text-sm"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">
                      Longitud
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        aria-label="Longitud"
                        className="text-sm"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
            {isLoading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Sede"
              : "Crear Sede"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useStore } from "@/store/useStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiService, { ApiValidationError } from "@/services/api.service";
import { Sede } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { SedeForm, SedeFormValues } from "./forms/sede";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

export function SedesSwitcher() {
  const { selectedSede, setSelectedSede } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: sedes, isLoading } = useQuery({
    queryKey: ["sedes"],
    queryFn: async () => {
      const data = await apiService.get("/sedes");
      return data.sedes as Sede[];
    },
  });

  const handleCreateSede = async (values: SedeFormValues) => {
    try {
      const token = await getToken();
      const response = await apiService.post("/admin/sedes", values, token!);
      toast.success("Sede creada correctamente");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    } catch (error) {
      console.error(error);
      if (error instanceof ApiValidationError) {
        toast.error(error.details[0].message);
      } else {
        toast.error("Error al crear la sede");
      }
    }
  };

  const handleAddSedeClick = () => {
    setIsModalOpen(true);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {selectedSede?.name || "Seleccionar sede"}
              <ChevronsUpDown className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {isLoading ? (
              <DropdownMenuItem>
                <Skeleton className="h-4 w-4" />
              </DropdownMenuItem>
            ) : (
              sedes?.map((sede) => (
                <DropdownMenuItem
                  key={sede.id}
                  onSelect={() => setSelectedSede(sede)}
                >
                  {sede.name}{" "}
                  {sede.id === selectedSede?.id && (
                    <Check className="ml-auto" />
                  )}
                </DropdownMenuItem>
              ))
            )}
            <Separator />
            <DropdownMenuItem
              className="m-2"
              onSelect={handleAddSedeClick}
              tabIndex={0}
              aria-label="Agregar nueva sede"
            >
              <PlusCircle className=" h-4 w-4" />
              Agregar sede
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar nueva sede</DialogTitle>
            <DialogDescription>
              Completa los datos de la nueva sede y selecciona su ubicación en
              el mapa.
            </DialogDescription>
          </DialogHeader>
          <SedeForm onSubmit={handleCreateSede} existingSedes={sedes || []} />
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}

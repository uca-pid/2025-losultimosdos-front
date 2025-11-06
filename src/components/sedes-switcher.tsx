"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useStore } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import { Sede } from "@/types";
import { Skeleton } from "./ui/skeleton";

export function SedesSwitcher() {
  const { selectedSede, setSelectedSede } = useStore();

  const { data: sedes, isLoading } = useQuery({
    queryKey: ["sedes"],
    queryFn: async () => {
      const data = await apiService.get("/sedes");
      return data.sedes as Sede[];
    },
  });

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
            <DropdownMenuItem className="m-2">
              <PlusCircle className=" h-4 w-4" />
              Agregar sede
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

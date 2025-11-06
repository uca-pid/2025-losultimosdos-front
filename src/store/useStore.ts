import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Sede } from "@/types";

const defaultSede: Sede = {
  id: 1,
  name: "Recoleta",
  address: "Av Pueyrredon 2068",
  latitude: -34.583333,
  longitude: -58.383333,
};

export const useStore = create(
  persist<{
    selectedSede: Sede;
    setSelectedSede: (sede: Sede) => void;
  }>(
    (set: (state: any) => void) => ({
      selectedSede: defaultSede,
      setSelectedSede: (sede: Sede) => set({ selectedSede: sede }),
    }),
    {
      name: "selected-sede",
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
    }
  )
);

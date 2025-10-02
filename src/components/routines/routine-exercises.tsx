"use client";

import { Exercise, RoutineExercise } from "@/types";
import { useEffect, useState } from "react";
import exerciseService from "@/services/exercise.service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoutineExerciseWithData
  extends Omit<RoutineExercise, "id" | "routineId"> {
  exerciseData: Exercise;
}

interface RoutineExercisesProps {
  value?: RoutineExerciseWithData[];
  onChange: (exercises: RoutineExerciseWithData[]) => void;
}

export const RoutineExercises = ({
  value = [],
  onChange,
}: RoutineExercisesProps) => {
  const [open, setOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exerciseService.getAllExercises();
        setExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, []);

  const handleAddExercise = (exercise: Exercise) => {
    const newRoutineExercise: RoutineExerciseWithData = {
      exerciseId: exercise.id,
      sets: 3,
      reps: 12,
      restTime: 60,
      exerciseData: exercise,
    };
    onChange([...value, newRoutineExercise]);
    setOpen(false);
  };

  const handleRemoveExercise = (exerciseId: number) => {
    onChange(value.filter((ex) => ex.exerciseId !== exerciseId));
  };

  const handleUpdateExercise = (
    index: number,
    field: keyof RoutineExercise,
    newValue: number
  ) => {
    const newExercises = [...value];
    newExercises[index] = {
      ...newExercises[index],
      [field]: newValue,
    };
    onChange(newExercises);
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Agregar ejercicio
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar ejercicio..." />
            <CommandList>
              <CommandGroup>
                <CommandEmpty className="flex items-center justify-center">
                  No se encontraron ejercicios.
                </CommandEmpty>
                {exercises.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    onSelect={() => handleAddExercise(exercise)}
                    className="cursor-pointer"
                    disabled={value.some((e) => e.exerciseId === exercise.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.some((e) => e.exerciseId === exercise.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {exercise.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="space-y-2">
        {value.map((routineExercise, index) => (
          <Card key={routineExercise.exerciseId} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">
                {routineExercise.exerciseData.name}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveExercise(routineExercise.exerciseId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Series</label>
                <Input
                  type="number"
                  value={routineExercise.sets}
                  onChange={(e) =>
                    handleUpdateExercise(
                      index,
                      "sets",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Repeticiones</label>
                <Input
                  type="number"
                  value={routineExercise.reps}
                  onChange={(e) =>
                    handleUpdateExercise(
                      index,
                      "reps",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descanso (seg)</label>
                <Input
                  type="number"
                  value={routineExercise.restTime}
                  onChange={(e) =>
                    handleUpdateExercise(
                      index,
                      "restTime",
                      parseInt(e.target.value)
                    )
                  }
                  min={0}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

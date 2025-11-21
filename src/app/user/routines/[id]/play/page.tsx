"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Exercise, Routine, RoutineExercise } from "@/types";
import { IconBarbell, IconClock } from "@tabler/icons-react";
import toast from "react-hot-toast";
import routineService, {
  BestPerformance,
  RoutineCompleteResponse,
} from "@/services/routine.service";

type Params = Promise<{ id: string }>;

type RoutineWithExercises = Routine & {
  exercises: (RoutineExercise & { exercise?: Exercise })[];
};

type ExerciseState = {
  exerciseId: number;
  completed: boolean;
  weight: string;
  reps: string;
};

export default function RoutinePlayPage({ params }: { params: Params }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const { id } = use(params);
  const routineId = Number(id);

  const [exercisesState, setExercisesState] = useState<ExerciseState[]>([]);

  const {
    data: routine,
    isLoading: isRoutineLoading,
    error: routineError,
  } = useQuery({
    queryKey: ["routine", routineId],
    queryFn: async () => {
      const token = await getToken();
      return routineService.getRoutine(
        Number(routineId),
        token
      ) as Promise<RoutineWithExercises>;
    },
  });

  const { data: bestPerformances = [], isLoading: isBestLoading } = useQuery({
    queryKey: ["routineBestPerformances", routineId],
    queryFn: async () => {
      const token = await getToken();
      return routineService.getBestPerformances(routineId, token);
    },
    enabled: !!routineId,
  });

  // inicializar estado cuando ya tenemos la rutina
  useEffect(() => {
    if (!routine) return;
    setExercisesState((prev) => {
      if (prev.length > 0) return prev;
      return routine.exercises.map((re) => ({
        exerciseId: re.exerciseId,
        completed: false,
        weight: "",
        reps: "",
      }));
    });
    }, [routine]);

const { mutateAsync: completeRoutine, isPending: isSaving } = useMutation<
  RoutineCompleteResponse, 
  Error,                  
  ExerciseState[]          
>({
  mutationFn: async (payload: ExerciseState[]) => {
    const token = await getToken();
    return routineService.completeRoutine(
      routineId,
      payload.map((ex) => ({
        exerciseId: ex.exerciseId,
        weight: Number(ex.weight),
        reps: Number(ex.reps),
      })),
      token
    );
  },
  onSuccess: (data) => {

    const pts = data.pointsAwarded ?? 0;
    if (pts > 0) {
      toast.success(`Rutina guardada. Ganaste ${pts} puntos 🏅`);
    } else {
      toast.success("Rutina guardada 💪");
    }

    router.push("/user/routines");
  },
  onError: () => {
    toast.error("Error al guardar la rutina.");
  },
});


  const handleChangeField = (
    exerciseId: number,
    field: "completed" | "weight" | "reps",
    value: boolean | string
  ) => {
    setExercisesState((prev) =>
      prev.map((ex) =>
        ex.exerciseId === exerciseId ? { ...ex, [field]: value as any } : ex
      )
    );
  };

  const handleSave = async () => {
    const payload = exercisesState.filter(
      (ex) => ex.completed && ex.weight && ex.reps
    );

    if (payload.length === 0) {
      toast.error("Marcá al menos un ejercicio completado con peso y reps.");
      return;
    }

    await completeRoutine(payload);
  };

  if (isRoutineLoading || isBestLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (routineError || !routine) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            No se pudo cargar la rutina. Intenta de nuevo más tarde.
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = exercisesState.filter((e) => e.completed).length;
  const total = exercisesState.length || routine.exercises.length;
  const progress = total ? Math.round((completedCount / total) * 100) : 0;

  const getBestForExercise = (
    exerciseId: number
  ): BestPerformance | undefined =>
    bestPerformances.find((b) => b.exerciseId === exerciseId);

  return (
    <div className="space-y-6">
      {/* Header rutina */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{routine.name}</CardTitle>
              <p className="text-muted-foreground">
                Registrá tu mejor serie de hoy y comparala con tu PR.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline">{routine.level}</Badge>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <IconClock size={18} />
                <span>{routine.duration} min</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progreso de la rutina</span>
              <span>
                {completedCount}/{total} ejercicios · {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Lista de ejercicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBarbell />
            Ejercicios de hoy
          </CardTitle>
          <CardDescription>
            Marcá cada ejercicio que hagas y registrá tu mejor serie. Si es la
            primera vez, la mejor histórica aparece como <strong>–</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {routine.exercises.map((re) => {
            const state = exercisesState.find(
              (e) => e.exerciseId === re.exerciseId
            );
            const best = getBestForExercise(re.exerciseId);

            return (
              <Card
                key={re.id}
                className={cn(
                  "transition-all border border-border",
                  state?.completed &&
                    "border-green-500/80 bg-green-50/40 dark:bg-green-950/20"
                )}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {re.exercise?.name ?? "Ejercicio"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {re.sets && re.reps
                        ? `${re.sets} x ${re.reps} reps`
                        : "Series libres"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Completado
                    </span>
                    <Checkbox
                      checked={state?.completed ?? false}
                      onCheckedChange={(checked) =>
                        handleChangeField(
                          re.exerciseId,
                          "completed",
                          Boolean(checked)
                        )
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="text-[11px] text-muted-foreground mb-1">
                        Mejor serie de hoy
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Peso (kg)"
                          value={state?.weight ?? ""}
                          onChange={(e) =>
                            handleChangeField(
                              re.exerciseId,
                              "weight",
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="Reps"
                          value={state?.reps ?? ""}
                          onChange={(e) =>
                            handleChangeField(
                              re.exerciseId,
                              "reps",
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="text-[11px] text-muted-foreground mb-1">
                        Mejor histórica
                      </div>
                      {best ? (
                        <div className="text-sm">
                          <span className="font-semibold">
                            {best.weight} kg
                          </span>{" "}
                          · {best.reps} reps
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">–</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar rutina"}
        </Button>
      </div>
    </div>
  );
}

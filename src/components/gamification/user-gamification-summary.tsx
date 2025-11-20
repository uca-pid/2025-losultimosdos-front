"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMyGamification } from "@/hooks/use-my-gamification";
import { getLevelForPoints } from "@/lib/levels";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function UserGamificationSummary() {
  const { userId } = useAuth();
  const { user } = useUser();
  const {
    sede,
    totalPoints,
    totalRank,
    last30Points,
    last30Rank,
    isLoading,
    isFetching,
  } = useMyGamification();

  if (!userId) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-3 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { level, progressToNext, nextLevelPoints } =
    getLevelForPoints(totalPoints);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-40 bg-[radial-gradient(circle_at_top,_#3b82f620,_transparent_60%),_radial-gradient(circle_at_bottom,_#22c55e20,_transparent_60%)]" />

      <CardHeader className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            Tu progreso en el gym
          </CardTitle>
          <CardDescription>
            Así vienen tus puntos en la sede{" "}
            <span className="font-semibold">{sede?.name ?? "global"}</span>.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {user?.firstName && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.firstName} {user.lastName ?? ""}
            </span>
          )}
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="h-9 w-9 rounded-full border shadow-sm"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5">
        {/* Puntos totales + nivel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase">
              Puntos totales
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {totalPoints.toLocaleString("es-AR")}
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-2 py-0.5",
                  level.level >= 4 && "bg-emerald-500/90 text-white",
                  level.level === 5 && "bg-purple-600 text-white"
                )}
              >
                Nivel {level.level} · {level.name}
              </Badge>
            </div>
            {nextLevelPoints && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Te faltan{" "}
                <span className="font-semibold">
                  {Math.max(0, nextLevelPoints - totalPoints)} pts
                </span>{" "}
                para el próximo nivel.
              </p>
            )}
          </div>

          {/* Ranking */}
          <div className="text-sm flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase">
                Ranking en tu sede
              </span>
              {isFetching && (
                <span className="text-[11px] text-muted-foreground">
                  Actualizando...
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{totalRank ?? "–"}</span>
              <span className="text-xs text-muted-foreground">posición</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso de nivel */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progreso del nivel</span>
            <span>{progressToNext}%</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>

        {/* Stats de los últimos 30 días */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-background/80 backdrop-blur-sm px-3 py-3">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">
              Últimos 30 días
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-semibold">
                {last30Points.toLocaleString("es-AR")}
              </span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {last30Points > 0
                ? "Seguí así, estás sumando seguido 💪"
                : "Todavía no sumaste puntos este mes. ¡Momento de arrancar!"}
            </p>
          </div>

          <div className="rounded-lg border bg-background/80 backdrop-blur-sm px-3 py-3">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">
              Ranking mensual
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-semibold">{last30Rank ?? "–"}</span>
              <span className="text-xs text-muted-foreground">posición</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {last30Rank
                ? "Esta es tu posición según los puntos del último mes."
                : "Todavía no entrás al ranking de este mes. Sumá puntos con clases y rutinas asignadas."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

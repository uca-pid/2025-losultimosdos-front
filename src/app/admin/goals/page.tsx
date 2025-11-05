// app/goals/page.tsx
import { CheckCircle2, XCircle } from "lucide-react";

import apiService from "@/services/api.service";
import GoalsAdminTable from "@/components/goals/admin-table";
import CreateGoalSheet from "@/components/goals/create-goal-sheet";
import { GymGoal } from "@/types";

const GoalsPage = async () => {
  // Pedimos activas y vencidas en paralelo
  const [activeResponse, finishedResponse] = (await Promise.all([
    apiService.get("/goals?active=true"),
    apiService.get("/goals?active=false"),
  ])) as [{ goals: GymGoal[] }, { goals: GymGoal[] }];

  const activeGoals = activeResponse?.goals || [];
  const finishedGoals = finishedResponse?.goals || [];

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Header + botón que abre la sheet de creación */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Metas activas</h1>
        <CreateGoalSheet />
      </div>

      {/* Tabla de metas activas */}
      <GoalsAdminTable goals={activeGoals} />

      {/* Metas finalizadas abajo */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Metas finalizadas</h2>
        {finishedGoals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay metas finalizadas.
          </p>
        ) : (
          <div className="space-y-2">
            {finishedGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-start justify-between rounded-lg border dark:border-gray-700 p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{goal.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Plazo:{" "}
                    {new Date(goal.endDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Progreso final: {goal.progress}%
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    Estado
                  </span>
                  <div className="flex items-center gap-1">
                    {goal.completed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">
                          Cumplida
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600 dark:text-red-400">
                          Fallida
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GoalsPage;

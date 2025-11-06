"use client";

import React from "react";
import { Goal } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { getCategoryLabel } from "@/schema/goalForm";
import { format, differenceInDays, isPast } from "date-fns";
import { es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Badge } from "../ui/badge";

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const endDate =
    goal.endDate instanceof Date ? goal.endDate : new Date(goal.endDate);

  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isExpired = isPast(endDate);
  const daysRemaining = differenceInDays(endDate, new Date());
  const isCompleted = goal.currentValue >= goal.targetValue;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(goal);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(goal.id);
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Completada</Badge>
      );
    }
    if (isExpired) {
      return <Badge className="bg-red-500 hover:bg-red-600">Expirada</Badge>;
    }
    if (daysRemaining <= 7) {
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">Urgente</Badge>
      );
    }
    return <Badge className="bg-blue-500 hover:bg-blue-600">En progreso</Badge>;
  };

  const getProgressBarColor = () => {
    if (isCompleted) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              {getStatusBadge()}
            </div>
            <CardDescription className="text-sm">
              {getCategoryLabel(goal.category)}
              {goal.targetClass && (
                <span className="block mt-1 text-xs">
                  Clase: {goal.targetClass.name} -{" "}
                  {format(
                    goal.targetClass.date instanceof Date
                      ? goal.targetClass.date
                      : new Date(goal.targetClass.date),
                    "dd/MM/yyyy",
                    {
                      locale: es,
                    }
                  )}{" "}
                  {goal.targetClass.time}
                </span>
              )}
              {goal.targetRoutine && (
                <span className="block mt-1 text-xs">
                  Rutina: {goal.targetRoutine.name} - {goal.targetRoutine.level}
                </span>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Abrir menú"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer"
                aria-label="Editar meta"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600"
                aria-label="Eliminar meta"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {goal.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {goal.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-semibold">
              {goal.currentValue} / {goal.targetValue}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor()} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso: ${progress.toFixed(0)}%`}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {progress.toFixed(1)}% completado
          </div>
        </div>

        <div className="flex justify-between items-center text-sm pt-2 border-t">
          <div>
            <p className="text-muted-foreground text-xs">Fecha límite</p>
            <p className="font-medium">
              {format(endDate, "dd 'de' MMMM, yyyy", {
                locale: es,
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Tiempo restante</p>
            <p className={`font-medium ${isExpired ? "text-red-600" : ""}`}>
              {isExpired
                ? "Expirada"
                : daysRemaining === 0
                ? "Hoy"
                : daysRemaining === 1
                ? "1 día"
                : `${daysRemaining} días`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

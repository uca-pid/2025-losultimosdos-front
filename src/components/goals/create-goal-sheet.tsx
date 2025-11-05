"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import apiService from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Debe matchear con tu schema Prisma / Zod
type GoalType = "MEMBERS" | "CLASS" | "ROUTINE";
type MembersScope = "TOTAL" | "BASIC" | "PREMIUM";

type ClassOption = { id: number; name: string };
type RoutineOption = { id: number; name: string };

const CreateGoalSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  // campos del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GoalType | "">("");
  const [membersScope, setMembersScope] = useState<MembersScope | "">("");
  const [classId, setClassId] = useState<string>("");
  const [routineId, setRoutineId] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  const [progress, setProgress] = useState<string>("0");
  const [endDate, setEndDate] = useState<string>("");

  // opciones para selects dinámicos
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [routines, setRoutines] = useState<RoutineOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const { getToken } = useAuth();
  const router = useRouter();

  // Cuando se abre la sheet, traemos clases y rutinas
  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const token = await getToken();

        // Clases
        const classesResponse = await apiService.get("/classes", token || undefined);
        const classesData = (classesResponse.classes || []) as any[];
        setClasses(
          classesData.map((c) => ({
            id: c.id,
            name: c.name,
          }))
        );

        // Rutinas
        const routinesResponse = await apiService.get("/routines", token || undefined);
        const routinesData = (routinesResponse.routines || routinesResponse.items || []) as any[];
        setRoutines(
          routinesData.map((r) => ({
            id: r.id,
            name: r.name,
          }))
        );
      } catch (error) {
        console.error("Error cargando clases/rutinas", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    void fetchOptions();
  }, [isOpen, getToken]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("");
    setMembersScope("");
    setClassId("");
    setRoutineId("");
    setTargetValue("");
    setProgress("0");
    setEndDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await getToken();
    if (!token) return;

    const parsedTarget = Number(targetValue);
    const parsedProgress = Number(progress || 0);

    const payload = {
      title,
      description,
      type: type as GoalType,
      membersScope: type === "MEMBERS" ? (membersScope || null) : null,
      classId: type === "CLASS" && classId ? Number(classId) : null,
      routineId: type === "ROUTINE" && routineId ? Number(routineId) : null,
      targetValue: isNaN(parsedTarget) ? 0 : parsedTarget,
      progress: isNaN(parsedProgress) ? 0 : parsedProgress,
      endDate, // el backend lo parsea (Zod lo pasa a Date)
      // completed se deja en false por default
    };

    await apiService.post("/admin/goals", payload, token);
    router.refresh();
    resetForm();
    setIsOpen(false);
  };

  const isDetailDisabled = !type;

  const detailPlaceholder = !type
    ? "Seleccioná primero el tipo de objetivo"
    : type === "MEMBERS"
    ? "Seleccioná el tipo de socios"
    : type === "CLASS"
    ? loadingOptions
      ? "Cargando clases..."
      : "Seleccioná la clase"
    : loadingOptions
    ? "Cargando rutinas..."
    : "Seleccioná la rutina";

  const detailValue =
    type === "MEMBERS"
      ? membersScope || ""
      : type === "CLASS"
      ? classId
      : type === "ROUTINE"
      ? routineId
      : "";

  const onChangeDetail = (value: string) => {
    if (type === "MEMBERS") setMembersScope(value as MembersScope);
    if (type === "CLASS") setClassId(value);
    if (type === "ROUTINE") setRoutineId(value);
  };

  const isDetailMissing =
    (type === "MEMBERS" && !membersScope) ||
    (type === "CLASS" && !classId) ||
    (type === "ROUTINE" && !routineId);

  const isSubmitDisabled =
    !title ||
    !description ||
    !type ||
    !targetValue ||
    !endDate ||
    isDetailMissing;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Crear Meta
      </Button>
      <SheetContent className="w-[90%] sm:w-[540px]" side="right">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Crear Meta</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ej: Aumentar socios Premium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Ej: Llegar a 120 socios activos en el plan Premium."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo de objetivo</Label>
            <Select
              value={type}
              onValueChange={(value: GoalType) => {
                setType(value);
                setMembersScope("");
                setClassId("");
                setRoutineId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná el tipo de objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBERS">Socios</SelectItem>
                <SelectItem value="CLASS">Una clase</SelectItem>
                <SelectItem value="ROUTINE">Una rutina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Detalle del objetivo</Label>
            <Select
              disabled={isDetailDisabled || loadingOptions}
              value={detailValue}
              onValueChange={onChangeDetail}
            >
              <SelectTrigger>
                <SelectValue placeholder={detailPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {!type && (
                  <SelectItem disabled value="placeholder">
                    Seleccioná primero el tipo de objetivo
                  </SelectItem>
                )}

                {type === "MEMBERS" && (
                  <>
                    <SelectItem value="TOTAL">Socios totales</SelectItem>
                    <SelectItem value="BASIC">Plan Básico</SelectItem>
                    <SelectItem value="PREMIUM">Plan Premium</SelectItem>
                  </>
                )}

                {type === "CLASS" &&
                  classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}

                {type === "ROUTINE" &&
                  routines.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetValue">Objetivo cuantificable</Label>
            <Input
              id="targetValue"
              type="number"
              min={0}
              placeholder="Ej: 120 (socios, asistentes, etc.)"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">Fecha límite</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitDisabled}>
              Guardar Meta
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateGoalSheet;

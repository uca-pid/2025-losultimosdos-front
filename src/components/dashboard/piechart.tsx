"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Sector, Label } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartPie } from "lucide-react";

import RoutineService from "@/services/routine.service";

type Item = { name: string; usersCount: number };
type Point = Item & { key: string; fill: string };

function buildConfig(data: Point[]): ChartConfig {
  const conf: Record<string, { label: string; color?: string }> = {
    users: { label: "Usuarios" },
  };
  data.forEach((d, i) => {
    const colorIdx = ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5;
    conf[d.key] = { label: d.name, color: `var(--chart-${colorIdx})` };
  });
  return conf as ChartConfig;
}

export default function ChartPiee() {
  const id = "routines-users-pie";
  const [data, setData] = useState<Point[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await RoutineService.getRoutinesUsersCount();
        const points: Point[] = (items ?? []).map((r, i) => ({
          ...r,
          key: `r-${i}`,
          fill: `var(--chart-${((i % 5) + 1) as 1 | 2 | 3 | 4 | 5})`,
        }));
        if (!mounted) return;
        setData(points);
        setActiveIndex(points.length ? 0 : -1);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Error al cargar datos");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const config = useMemo(() => buildConfig(data), [data]);

  const noRoutines = !loading && !error && data.length === 0;
  const noAssignments =
    !loading &&
    !error &&
    data.length > 0 &&
    data.every((d) => d.usersCount === 0);

  return (
    <Card data-chart={id} className="h-full flex flex-col">
      <ChartStyle id={id} config={config} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="flex items-center gap-2">
            <ChartPie className="h-5 w-5" />
            Usuarios por rutina
          </CardTitle>
          <CardDescription>Distribución total de asignaciones</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 min-h-0 justify-center pb-0">
        {error ? (
          <div className="pt-6 text-sm text-destructive">{error}</div>
        ) : loading ? (
          <div className="pt-6 text-sm text-muted-foreground">
            Cargando datos…
          </div>
        ) : noRoutines ? (
          <div className="pt-6 text-sm text-muted-foreground">
            No hay rutinas creadas aún.
          </div>
        ) : noAssignments ? (
          <div className="pt-6 text-sm text-muted-foreground">
            Aún no hay usuarios asignados a ninguna rutina.
          </div>
        ) : (
          <ChartContainer id={id} config={config} className="h-full w-full">
            <PieChart width={undefined} height={undefined}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="usersCount"
                nameKey="name"
                innerRadius="55%"
                strokeWidth={5}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(-1)}
                activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    const idx = activeIndex >= 0 ? activeIndex : 0;
                    if (!data[idx]) return null;
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const value = data[idx].usersCount;
                      const name = data[idx].name;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {value.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="fill-muted-foreground text-xs"
                          >
                            Usuarios
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 36}
                            className="fill-muted-foreground text-[10px]"
                          >
                            {name}
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

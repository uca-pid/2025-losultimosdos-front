
"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

import ClassService, { type ClassEnrollItem } from "@/services/class.service";

type Point = ClassEnrollItem & { short: string };

const chartConfig: ChartConfig = {
  enroll: {
    label: "Inscriptos",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
};

function shorten(s: string, max = 28) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function EnrollTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as Point & { enroll: number };
  return (
    <div className="rounded-md border bg-background p-2 text-sm shadow">
      <div className="font-medium">{p.name}</div>
      <div className="text-muted-foreground">
        {p.enroll} inscriptos
      </div>
    </div>
  );
}

export function ChartBar() {
  const [data, setData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const items = await ClassService.getEnrollmentsCount(true);
        const points = (items ?? [])
          .map((c) => ({ ...c, short: shorten(c.name) }))
          .sort(
            (a, b) =>
              b.enrollCount - a.enrollCount || a.name.localeCompare(b.name)
          );

        if (!mounted) return;
        setData(points);
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

  const noClasses = !loading && !error && data.length === 0;
  const noEnrolls =
    !loading && !error && data.length > 0 && data.every((d) => d.enrollCount === 0);

  const chartData = useMemo(
    () => data.map((d) => ({ ...d, enroll: d.enrollCount })),
    [data]
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Clases por inscriptos</CardTitle>
        <CardDescription>Próximas clases (ordenadas por inscriptos)</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {error ? (
          <div className="pt-6 text-sm text-destructive">{error}</div>
        ) : loading ? (
          <div className="pt-6 text-sm text-muted-foreground">Cargando datos…</div>
        ) : noClasses ? (
          <div className="pt-6 text-sm text-muted-foreground">No hay clases creadas aún.</div>
        ) : noEnrolls ? (
          <div className="pt-6 text-sm text-muted-foreground">
            Aún no hay inscriptos en ninguna clase.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="short"
                tickLine={false}
                tickMargin={10}
                axisLine={false}

                tickFormatter={(value: string) => (value ?? "").slice(0, 3)}
              />

              <ChartTooltip cursor={false} content={<EnrollTooltip />} />
              <Bar dataKey="enroll" fill="var(--color-enroll)" radius={8}>
                <LabelList
                  dataKey="enroll"
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ChartBar;

"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

export const description = "A line chart with dots";

type Bucket = { hour: string; total: number };

const HOURS: string[] = Array.from({ length: 13 }, (_, i) =>
  String(8 + i).padStart(2, "0")
);

const chartConfig = {
  Inscriptos: {
    label: "Inscriptos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLine() {
  const [data, setData] = useState<{ hour: string; Inscriptos: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [top, setTop] = useState<Bucket | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

        const res = await fetch(`${base}/classes/busiest-hour?upcoming=true`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json: { items: Bucket[]; top: Bucket | null } = await res.json();

        const totals = new Map<string, number>();
        (json.items ?? []).forEach((b) => {
          const h = (b.hour ?? "").toString().padStart(2, "0");
          totals.set(h, (totals.get(h) ?? 0) + (b.total ?? 0));
        });

        const rows = HOURS.map((h) => ({
          hour: h,
          Inscriptos: totals.get(h) ?? 0,
        }));

        if (!mounted) return;
        setData(rows);
        setTop(json.top ?? null);
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

  const allZero = useMemo(
    () => data.length > 0 && data.every((d) => d.Inscriptos === 0),
    [data]
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Inscripciones por hora</CardTitle>
        <CardDescription>Próximas clases · 08–20 hs</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {error ? (
          <div className="pt-6 text-sm text-destructive">{error}</div>
        ) : loading ? (
          <div className="pt-6 text-sm text-muted-foreground">
            Cargando datos…
          </div>
        ) : allZero ? (
          <div className="pt-6 text-sm text-muted-foreground">
            Aún no hay inscriptos en las próximas horas.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v: string) => v} 
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="Inscriptos"
                type="natural"
                stroke="var(--color-Inscriptos)"
                strokeWidth={2}
                dot={{ fill: "var(--color-Inscriptos)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ChartLine;

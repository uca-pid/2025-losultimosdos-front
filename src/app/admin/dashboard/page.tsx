"use client";

import { useEffect, useState } from "react";
import ChartPiee from "@/components/dashboard/piechart";
import { ChartBar } from "@/components/dashboard/barchart";
import { ChartArea } from "@/components/dashboard/memberchart";
import { ChartLine } from "@/components/dashboard/linechart";
import RoutineService from "@/services/routine.service";
import ClassService from "@/services/class.service";
import apiService from "@/services/api.service";

type ViewKey = "members" | "classes" | "hours" | "routines";

const AdminPage = () => {
  const [view, setView] = useState<ViewKey>("members");
  const [topRoutineName, setTopRoutineName] = useState<string>("—");
  const [topClassName, setTopClassName] = useState<string>("—");
  const [busiestHour, setBusiestHour] = useState<string>("—");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const json = await apiService.get(
          "/classes/busiest-hour?upcoming=true"
        );
        if (!mounted) return;
        const top = json.top as { hour: string; total: number } | null;
        setBusiestHour(top ? `${top.hour}:00` : "Sin datos");
      } catch {
        if (!mounted) return;
        setBusiestHour("Error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await RoutineService.getRoutinesUsersCount();
        if (!mounted) return;

        if (!items || items.length === 0) {
          setTopRoutineName("Sin rutinas");
          return;
        }
        let max = items[0];
        for (let i = 1; i < items.length; i++) {
          if (items[i].usersCount > max.usersCount) max = items[i];
        }
        setTopRoutineName(max.usersCount > 0 ? max.name : "Sin asignaciones");
      } catch {
        if (!mounted) return;
        setTopRoutineName("Error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await ClassService.getEnrollmentsCount(true);
        if (!mounted) return;

        if (!items || items.length === 0) {
          setTopClassName("Sin clases");
          return;
        }

        let max = items[0];
        for (let i = 1; i < items.length; i++) {
          if (items[i].enrollCount > max.enrollCount) max = items[i];
        }
        setTopClassName(max.enrollCount > 0 ? max.name : "Sin inscriptos");
      } catch {
        if (!mounted) return;
        setTopClassName("Error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = {
    totalMembers: 1280,
    newMembersPctLastMonth: 7.8,
    busiestHour: "18:00",
    leastBusyHour: "12:00",
  };

  const renderChart = () => {
    switch (view) {
      case "members":
        return <ChartArea />;
      case "classes":
        return <ChartBar />;
      case "hours":
        return <ChartLine />;
      case "routines":
        return <ChartPiee />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          active={view === "members"}
          onClick={() => setView("members")}
          title="Miembros"
          value={Intl.NumberFormat("es-AR").format(stats.totalMembers)}
          subtitle={`${stats.newMembersPctLastMonth}% se unieron el último mes`}
        />

        <KpiCard
          active={view === "classes"}
          onClick={() => setView("classes")}
          title="Clases"
          value={topClassName}
          subtitle="Más concurrida (próximas)"
        />

        <KpiCard
          active={view === "hours"}
          onClick={() => setView("hours")}
          title="Horarios"
          value={`Pico: ${busiestHour}`}
          subtitle={`(De las proximas clases)`}
        />

        <KpiCard
          active={view === "routines"}
          onClick={() => setView("routines")}
          title="Rutinas"
          value={topRoutineName}
          subtitle="Con más usuarios"
        />
      </div>

      <div className="rounded-2xl border bg-background p-3 shadow-sm h-[420px] overflow-hidden">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {view === "members"
              ? "Socios (evolución)"
              : view === "classes"
              ? "Clases (asistencia)"
              : view === "hours"
              ? "Ocupación por hora"
              : "Inscripción por rutina"}
          </p>
        </div>
        <div className="h-[calc(100%-2rem)]">{renderChart()}</div>
      </div>
    </div>
  );
};

export default AdminPage;

function KpiCard({
  active,
  onClick,
  title,
  value,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  value?: string;
  subtitle?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-all hover:shadow-md ${
        active ? "ring-2 ring-primary shadow-md" : "hover:bg-accent/40"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="mt-1 text-2xl font-semibold leading-tight">
        {value ?? "—"}
      </div>
      {subtitle && (
        <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
      )}
      <div className="mt-2 text-xs opacity-70">Ver detalle →</div>
    </button>
  );
}

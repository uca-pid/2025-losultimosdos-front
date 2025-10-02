import { Skeleton } from "../ui/skeleton";

const RoutineSkeleton = () => {
  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded" /> {/* Input */}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded" />
      </div>

      {/* Nivel + Duración */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>

      {/* Icono */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded" />
      </div>

      {/* Ejercicios */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="rounded-xl border p-4 space-y-4">
          <Skeleton className="h-5 w-32" /> {/* Exercise name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-36 rounded" />
      </div>
    </div>
  );
};

export default RoutineSkeleton;

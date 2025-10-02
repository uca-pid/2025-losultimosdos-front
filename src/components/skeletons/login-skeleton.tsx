import { Skeleton } from "@/components/ui/skeleton";

export default function SignInSkeleton() {
  return (
    <div className="w-[400px] h-[485px] rounded-xl border bg-card p-6 shadow-sm">
      {/* Title */}
      <div className="space-y-2 text-center mb-6">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>

      {/* OAuth buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-px w-full" />
      </div>

      {/* Email input */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Continue button */}
      <Skeleton className="h-10 w-full rounded-md mb-6" />

      {/* Footer text */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

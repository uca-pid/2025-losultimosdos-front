import { Skeleton } from "@/components/ui/skeleton";

export function LoginFormSkeleton() {
  return (
    <div className="flex flex-col space-y-6 w-[415px] h-[481px] mx-auto p-6 bg-white rounded-md shadow-md   ">
      {/* Title */}
      <div className="space-y-2 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Divider */}
      <div className="relative">
        <Skeleton className="h-[1px] w-full" />
        <Skeleton className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full" />
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Continue Button */}
      <Skeleton className="h-10 w-full" />

      {/* Register Link */}
      <div className="flex justify-center items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Secured by Clerk */}
      <div className="flex justify-center items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

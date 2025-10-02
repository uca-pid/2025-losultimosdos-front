import { Skeleton } from "../ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="rounded-md border">
        <div className="border-b">
          <div className="grid grid-cols-5 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-[80%]" />
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b">
              <div className="grid grid-cols-5 p-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-[80%]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>

      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
}

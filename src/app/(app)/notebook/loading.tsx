import { Skeleton } from "@/components/ui/skeleton";

export default function NotebookLoading() {
  return (
    <div className="container mx-auto py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

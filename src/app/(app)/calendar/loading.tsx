import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="container mx-auto py-8 pb-24">
      <Skeleton className="h-9 w-48 mb-6" />
      <Skeleton className="h-[500px] w-full rounded-lg" />
    </div>
  );
}

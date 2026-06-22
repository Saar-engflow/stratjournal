import { Button } from "@/components/ui/button";

interface DayCellProps {
  day: number;
  isCurrentMonth: boolean;
  profitLoss: number;
  tradesCount: number;
  hasNotes: boolean;
  onClick: () => void;
}

export function DayCell({
  day,
  isCurrentMonth,
  profitLoss,
  tradesCount,
  hasNotes,
  onClick,
}: DayCellProps) {
  // Determine background color
  let bgColor = "bg-transparent";
  let textColor = "text-foreground";
  if (!isCurrentMonth) {
    bgColor = "bg-transparent";
    textColor = "text-muted-foreground";
  } else if (tradesCount > 0) {
    if (profitLoss > 0) {
      bgColor = "bg-green-100 dark:bg-green-900/20";
      textColor = "text-green-700 dark:text-green-400";
    } else if (profitLoss < 0) {
      bgColor = "bg-red-100 dark:bg-red-900/20";
      textColor = "text-red-700 dark:text-red-400";
    } else {
      bgColor = "bg-gray-100 dark:bg-gray-800/50";
    }
  }

  return (
    <Button
      variant="ghost"
      className={`flex flex-col items-center justify-start p-2 h-24 w-full ${bgColor} hover:opacity-80`}
      onClick={onClick}
    >
      <span className={`text-sm font-medium ${textColor}`}>{day}</span>
      {tradesCount > 0 && (
        <div className="flex flex-col items-center mt-1 gap-1">
          <span className={`text-xs font-bold ${textColor}`}>
            {profitLoss > 0 ? `+${profitLoss.toFixed(2)}` : profitLoss.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">{tradesCount} trade{tradesCount !== 1 ? "s" : ""}</span>
        </div>
      )}
      {hasNotes && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />}
    </Button>
  );
}

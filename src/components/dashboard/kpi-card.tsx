import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "profit" | "loss";
}

export function KpiCard({ title, value, subtitle, variant = "default" }: KpiCardProps) {
  let colorClass = "";
  if (variant === "profit") {
    colorClass = "text-green-600 dark:text-green-400";
  } else if (variant === "loss") {
    colorClass = "text-red-600 dark:text-red-400";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

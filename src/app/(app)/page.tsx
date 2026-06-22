import { requireUser } from "@/lib/auth";
import { getDashboardMetrics } from "@/server/analytics/dashboard-metrics";
import { KpiCard } from "@/components/dashboard/kpi-card";

export default async function DashboardPage() {
  const user = await requireUser();
  const metrics = await getDashboardMetrics(user.id);

  const hasTrades = metrics.totalTrades > 0;

  const netPlVariant = metrics.netProfitLoss > 0 ? "profit" : metrics.netProfitLoss < 0 ? "loss" : "default";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {!hasTrades ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground">No trading data available yet.</p>
          <p className="text-sm text-muted-foreground">Start by creating your first trade.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <KpiCard title="Total Trades" value={metrics.totalTrades} />
          <KpiCard title="Open Trades" value={metrics.openTrades} />
          <KpiCard title="Closed Trades" value={metrics.closedTrades} />
          <KpiCard
            title="Win Rate"
            value={`${Math.round(metrics.winRate)}%`}
            subtitle={metrics.closedTrades === 0 ? "No closed trades yet" : undefined}
          />
          <KpiCard
            title="Net P/L"
            value={metrics.netProfitLoss.toFixed(2)}
            variant={netPlVariant}
          />
        </div>
      )}
    </div>
  );
}

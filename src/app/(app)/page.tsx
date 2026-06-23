import { requireUser } from "@/lib/auth";
import { getActiveAccountForUser } from "@/server/accounts/account.service";
import { getDashboardMetrics } from "@/server/analytics/dashboard-metrics";
import { getChartData } from "@/server/analytics/dashboard-charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { RecentTrades } from "@/components/dashboard/recent-trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButtons } from "@/features/export/components/export-buttons";

export default async function DashboardPage() {
  const user = await requireUser();
  const activeAccount = await getActiveAccountForUser(user.id);
  const metrics = await getDashboardMetrics(user.id, activeAccount?.id);
  const chartData = await getChartData(user.id, activeAccount?.id);

  const hasTrades = metrics.totalTrades > 0;
  const hasClosedTrades = metrics.closedTrades > 0;

  const netPlVariant = metrics.netProfitLoss > 0 ? "profit" : metrics.netProfitLoss < 0 ? "loss" : "default";

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ExportButtons />
      </div>

      {!hasTrades ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground">No trading data available yet.</p>
          <p className="text-sm text-muted-foreground">Charts will appear once trades are recorded.</p>
        </div>
      ) : (
        <div className="space-y-6">
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

          {hasClosedTrades && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart data={chartData.performance} />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Win/Loss Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendChart data={chartData.trend} />
                  </CardContent>
                </Card>

                <RecentTrades trades={chartData.recentTrades} />
              </div>
            </>
          )}

          {!hasClosedTrades && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted-foreground">Charts will appear once trades are closed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

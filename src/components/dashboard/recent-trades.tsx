import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TradeListItem } from "@/types/trade";

interface RecentTradesProps {
  trades: TradeListItem[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trades.map((trade) => {
          const isWin = trade.profitLoss && trade.profitLoss > 0;
          return (
            <Link
              key={trade.id}
              href={`/trades/${trade.id}`}
              className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{trade.instrument}</div>
                  <div className="text-sm text-muted-foreground">
                    {trade.direction} · {new Date(trade.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {trade.status === "CLOSED" ? (
                  <div
                    className={`font-medium ${isWin ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {isWin ? "+" : ""}
                    {trade.profitLoss?.toFixed(2)}
                  </div>
                ) : (
                  <Badge variant="outline">Open</Badge>
                )}
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

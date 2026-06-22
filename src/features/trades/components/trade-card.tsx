import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import type { TradeListItem } from "@/types/trade"

interface TradeCardProps {
  trade: TradeListItem
}

export function TradeCard({ trade }: TradeCardProps) {
  const directionColor = trade.direction === "BUY" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {trade.instrument}
              <span className={directionColor}>{trade.direction}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{trade.account.name}</p>
          </div>
          <Badge variant={trade.status === "OPEN" ? "default" : "secondary"}>
            {trade.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Entry</p>
            <p>{trade.entryPrice.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">SL</p>
            <p>{trade.stopLoss.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">TP</p>
            <p>{trade.takeProfit.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lots</p>
            <p>{trade.lotSize.toFixed(2)}</p>
          </div>
        </div>
        {trade.profitLoss !== null && (
          <div className="mt-2 pt-2 border-t">
            <p className={trade.profitLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {trade.profitLoss >= 0 ? "+" : ""}{trade.profitLoss.toFixed(2)}
            </p>
          </div>
        )}
        {trade.playbook && (
          <div className="mt-2 pt-2 border-t">
            <Badge variant="outline">{trade.playbook.name}</Badge>
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/trades/${trade.id}`}>View</Link>
          </Button>
          {trade.status === "OPEN" && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/trades/${trade.id}/edit`}>Edit</Link>
              </Button>
              <Button variant="destructive" size="sm" asChild>
                <Link href={`/trades/${trade.id}/close`}>Close</Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

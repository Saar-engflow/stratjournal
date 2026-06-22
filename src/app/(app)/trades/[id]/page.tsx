import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon } from "lucide-react"

import { requireUser } from "@/lib/auth"
import { getTradeForUser } from "@/server/trades/trade.service"

export default async function TradeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireUser()
  const trade = await getTradeForUser(user.id, params.id)

  if (!trade) {
    notFound()
  }

  const directionColor = trade.direction === "BUY" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trades">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Trades
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {trade.instrument}
                <span className={directionColor}>{trade.direction}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Account: {trade.account.name}
                {trade.playbook && ` • Playbook: ${trade.playbook.name}`}
              </p>
            </div>
            <Badge variant={trade.status === "OPEN" ? "default" : "secondary"}>
              {trade.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Entry Price</p>
              <p className="font-medium">{trade.entryPrice.toFixed(5)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stop Loss</p>
              <p className="font-medium">{trade.stopLoss.toFixed(5)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Take Profit</p>
              <p className="font-medium">{trade.takeProfit.toFixed(5)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lot Size</p>
              <p className="font-medium">{trade.lotSize.toFixed(2)}</p>
            </div>
          </div>

          {trade.status === "CLOSED" && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Profit/Loss</p>
                <p className={`font-medium ${trade.profitLoss && trade.profitLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {trade.profitLoss ? (trade.profitLoss >= 0 ? "+" : "") + trade.profitLoss.toFixed(2) : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Closed At</p>
                <p className="font-medium">
                  {trade.closedAt ? new Date(trade.closedAt).toLocaleString() : "-"}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{new Date(trade.createdAt).toLocaleString()}</p>
            </div>

            {trade.status === "OPEN" && (
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href={`/trades/${trade.id}/edit`}>Edit Trade</Link>
                </Button>
                <Button variant="destructive" asChild>
                  <Link href={`/trades/${trade.id}/close`}>Close Trade</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

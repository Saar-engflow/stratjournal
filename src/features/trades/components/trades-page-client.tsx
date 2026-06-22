"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { TradeCard } from "./trade-card"

import type { TradeListItem } from "@/types/trade"

interface TradesPageClientProps {
  trades: TradeListItem[]
}

export function TradesPageClient({ trades }: TradesPageClientProps) {
  const router = useRouter()

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Trades</h1>
          <Button onClick={() => router.push("/trades/new")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Trade
          </Button>
        </div>

        {trades.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No trades yet</h3>
            <p className="text-muted-foreground mb-4">Start by logging your first trade</p>
            <Button onClick={() => router.push("/trades/new")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Trade
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

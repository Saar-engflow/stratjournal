"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { TradeCard } from "./trade-card"
import { exportTradesAction } from "@/server/export/export.actions"

import type { TradeListItem } from "@/types/trade"

function downloadFile(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

interface TradesPageClientProps {
  trades: TradeListItem[]
}

export function TradesPageClient({ trades }: TradesPageClientProps) {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExportTrades = async () => {
    setIsExporting(true)
    setError(null)
    try {
      const result = await exportTradesAction()
      if (result.success) {
        downloadFile(result.csv, result.filename)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Unable to generate export. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-2">
          <h1 className="text-3xl font-bold">Trades</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExportTrades} disabled={isExporting}>
              {isExporting ? "Generating export..." : "Export Trades"}
            </Button>
            <Button onClick={() => router.push("/trades/new")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Trade
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md mb-4">
            {error}
          </div>
        )}

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

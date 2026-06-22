import type { Trade, TradeStatus } from "@prisma/client"

import type { PlaybookStats } from "@/types/playbook"

type TradeForStats = Pick<Trade, "status" | "profitLoss">

/**
 * Derives playbook performance metrics from linked trade records.
 * Analytics use closed trades only; open trades count toward total trade count.
 */
export function computePlaybookStats(trades: TradeForStats[]): PlaybookStats {
  const tradeCount = trades.length
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED")

  let wins = 0
  let losses = 0
  let netProfitLoss = 0

  for (const trade of closedTrades) {
    const value = trade.profitLoss ? Number(trade.profitLoss) : 0
    netProfitLoss += value

    if (value > 0) {
      wins += 1
    } else if (value < 0) {
      losses += 1
    }
  }

  const winRate =
    closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0

  return {
    tradeCount,
    totalTrades: closedTrades.length,
    wins,
    losses,
    winRate,
    netProfitLoss,
  }
}

export function getTradeResult(
  status: TradeStatus,
  profitLoss: number | null
): string {
  if (status === "OPEN") {
    return "Open"
  }

  if (profitLoss === null || profitLoss === 0) {
    return "Breakeven"
  }

  return profitLoss > 0 ? "Win" : "Loss"
}

import { prisma } from "@/lib/prisma"

import type { TradeListItem, TradeDetail } from "@/types/trade"

export async function listTradesForUser(userId: string): Promise<TradeListItem[]> {
  const trades = await prisma.trade.findMany({
    where: { userId },
    include: {
      account: { select: { id: true, name: true } },
      playbook: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return trades.map((trade) => ({
    id: trade.id,
    instrument: trade.instrument,
    direction: trade.direction,
    entryPrice: Number(trade.entryPrice),
    stopLoss: Number(trade.stopLoss),
    takeProfit: Number(trade.takeProfit),
    lotSize: Number(trade.lotSize),
    status: trade.status,
    profitLoss: trade.profitLoss ? Number(trade.profitLoss) : null,
    account: trade.account,
    playbook: trade.playbook,
    createdAt: trade.createdAt,
    closedAt: trade.closedAt,
  }))
}

export async function createTradeForUser(
  userId: string,
  data: {
    instrument: string
    direction: "BUY" | "SELL"
    entryPrice: number
    stopLoss: number
    takeProfit: number
    lotSize: number
    accountId: string
    playbookId?: string | null
  }
) {
  // Verify account belongs to user
  const account = await prisma.account.findFirst({
    where: { id: data.accountId, userId },
    select: { id: true },
  })

  if (!account) {
    throw new Error("Invalid account")
  }

  // Verify playbook belongs to user if provided
  if (data.playbookId) {
    const playbook = await prisma.playbook.findFirst({
      where: { id: data.playbookId, userId },
      select: { id: true },
    })

    if (!playbook) {
      throw new Error("Invalid playbook")
    }
  }

  return prisma.trade.create({
    data: {
      userId,
      instrument: data.instrument,
      direction: data.direction,
      entryPrice: data.entryPrice,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      lotSize: data.lotSize,
      accountId: data.accountId,
      playbookId: data.playbookId || null,
    },
  })
}

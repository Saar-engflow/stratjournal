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

export async function getTradeForUser(
  userId: string,
  tradeId: string
): Promise<TradeDetail | null> {
  let tradeWithNote: any = null;

  try {
    tradeWithNote = await prisma.trade.findFirst({
      where: { id: tradeId, userId },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        playbook: { select: { id: true, name: true } },
        note: true,
      },
    });
  } catch (e) {
    // If note table doesn't exist yet, fetch without note
    tradeWithNote = await prisma.trade.findFirst({
      where: { id: tradeId, userId },
      include: {
        account: { select: { id: true, name: true, currency: true } },
        playbook: { select: { id: true, name: true } },
      },
    });
  }

  if (!tradeWithNote) {
    return null;
  }

  return {
    id: tradeWithNote.id,
    instrument: tradeWithNote.instrument,
    direction: tradeWithNote.direction,
    entryPrice: Number(tradeWithNote.entryPrice),
    stopLoss: Number(tradeWithNote.stopLoss),
    takeProfit: Number(tradeWithNote.takeProfit),
    lotSize: Number(tradeWithNote.lotSize),
    status: tradeWithNote.status,
    profitLoss: tradeWithNote.profitLoss ? Number(tradeWithNote.profitLoss) : null,
    account: tradeWithNote.account,
    playbook: tradeWithNote.playbook,
    note: tradeWithNote.note ? {
      id: tradeWithNote.note.id,
      content: tradeWithNote.note.content,
      createdAt: tradeWithNote.note.createdAt,
      updatedAt: tradeWithNote.note.updatedAt
    } : null,
    userId: tradeWithNote.userId,
    createdAt: tradeWithNote.createdAt,
    updatedAt: tradeWithNote.updatedAt,
    closedAt: tradeWithNote.closedAt,
  };
}

export async function upsertTradeNoteForUser(
  userId: string,
  tradeId: string,
  content: string | null
) {
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  if (trade.status !== "OPEN") {
    throw new Error("Cannot edit note for closed trade")
  }

  try {
    return await prisma.tradeNote.upsert({
      where: { tradeId },
      create: {
        tradeId,
        content,
      },
      update: {
        content,
      },
    })
  } catch (e) {
    throw new Error("Trade notes feature requires database setup. Please run `npx prisma db push` in your terminal.")
  }
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

export async function updateTradeForUser(
  userId: string,
  tradeId: string,
  data: {
    instrument?: string
    direction?: "BUY" | "SELL"
    entryPrice?: number
    stopLoss?: number
    takeProfit?: number
    lotSize?: number
    accountId?: string
    playbookId?: string | null
  }
) {
  // Get trade and verify ownership
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  if (trade.status !== "OPEN") {
    throw new Error("Only open trades can be edited")
  }

  // Verify account belongs to user if updated
  if (data.accountId) {
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
      select: { id: true },
    })

    if (!account) {
      throw new Error("Invalid account")
    }
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

  return prisma.trade.update({
    where: { id: tradeId },
    data: {
      ...data,
      playbookId: data.playbookId !== undefined ? data.playbookId || null : undefined,
    },
  })
}

export async function closeTradeForUser(
  userId: string,
  tradeId: string,
  profitLoss: number
) {
  // Get trade and verify ownership
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  if (trade.status !== "OPEN") {
    throw new Error("Only open trades can be closed")
  }

  return prisma.trade.update({
    where: { id: tradeId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      profitLoss,
    },
  })
}

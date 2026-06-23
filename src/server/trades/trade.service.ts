import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage, getSignedImageUrl } from "@/lib/blob"

import type { TradeListItem, TradeDetail } from "@/types/trade"

export async function listTradesForUser(userId: string, accountId?: string): Promise<TradeListItem[]> {
  const where: any = { userId };
  if (accountId) {
    where.accountId = accountId;
  }
  
  const trades = await prisma.trade.findMany({
    where,
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
        note: { include: { images: true } },
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

  // Get signed URLs for images
  let imagesWithSignedUrls = []
  if (tradeWithNote.note?.images) {
    imagesWithSignedUrls = await Promise.all(
      tradeWithNote.note.images.map(async (img: any) => ({
        ...img,
        url: await getSignedImageUrl(img.url)
      }))
    )
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
      updatedAt: tradeWithNote.note.updatedAt,
      images: imagesWithSignedUrls || [],
    } : null,
    userId: tradeWithNote.userId,
    createdAt: tradeWithNote.createdAt,
    updatedAt: tradeWithNote.updatedAt,
    closedAt: tradeWithNote.closedAt,
  };
}

export async function uploadTradeImageForUser(
  userId: string,
  tradeId: string,
  file: File
) {
  // Get trade and verify ownership and status
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  if (trade.status !== "OPEN") {
    throw new Error("Cannot upload images for closed trade")
  }

  // Get or create trade note
  let tradeNote = await prisma.tradeNote.findUnique({
    where: { tradeId },
  })

  if (!tradeNote) {
    tradeNote = await prisma.tradeNote.create({
      data: {
        tradeId,
        content: null,
      },
    })
  }

  // Upload to Vercel Blob
  const { url, pathname } = await uploadImage(file)

  // Save metadata to DB
  return prisma.tradeImage.create({
    data: {
      tradeNoteId: tradeNote.id,
      url,
      pathname,
    },
  })
}

export async function deleteTradeImageForUser(
  userId: string,
  tradeId: string,
  imageId: string
) {
  // Get trade and verify ownership and status
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
    include: { note: { include: { images: true } } },
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  if (!trade.note) {
    throw new Error("Trade note not found")
  }

  if (trade.status !== "OPEN") {
    throw new Error("Cannot delete images for closed trade")
  }

  const image = trade.note.images.find((img) => img.id === imageId)

  if (!image) {
    throw new Error("Image not found")
  }

  // Delete from Vercel Blob
  await deleteImage(image.url)

  // Delete from DB
  return prisma.tradeImage.delete({
    where: { id: imageId },
  })
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

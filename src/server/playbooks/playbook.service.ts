import { prisma } from "@/lib/prisma"
import type {
  PlaybookDetail,
  PlaybookListItem,
  PlaybookTradeSummary,
} from "@/types/playbook"

import { computePlaybookStats, getTradeResult } from "./playbook.stats"

/**
 * Returns all playbooks owned by the user with derived trade statistics.
 */
export async function listPlaybooksForUser(userId: string): Promise<PlaybookListItem[]> {
  const playbooks = await prisma.playbook.findMany({
    where: { userId },
    include: {
      trades: {
        select: {
          status: true,
          profitLoss: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return playbooks.map((playbook) => ({
    id: playbook.id,
    name: playbook.name,
    description: playbook.description,
    createdAt: playbook.createdAt,
    stats: computePlaybookStats(playbook.trades),
  }))
}

/**
 * Returns a single playbook with ownership enforced and derived statistics.
 */
export async function getPlaybookForUser(
  userId: string,
  playbookId: string
): Promise<PlaybookDetail | null> {
  const playbook = await prisma.playbook.findFirst({
    where: {
      id: playbookId,
      userId,
    },
    include: {
      trades: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          instrument: true,
          direction: true,
          status: true,
          profitLoss: true,
          createdAt: true,
        },
      },
    },
  })

  if (!playbook) {
    return null
  }

  const allTrades = await prisma.trade.findMany({
    where: { playbookId: playbook.id, userId },
    select: {
      status: true,
      profitLoss: true,
    },
  })

  const recentTrades: PlaybookTradeSummary[] = playbook.trades.map((trade) => ({
    id: trade.id,
    instrument: trade.instrument,
    direction: trade.direction,
    status: trade.status,
    profitLoss: trade.profitLoss ? Number(trade.profitLoss) : null,
    createdAt: trade.createdAt,
    result: getTradeResult(
      trade.status,
      trade.profitLoss ? Number(trade.profitLoss) : null
    ),
  }))

  return {
    id: playbook.id,
    name: playbook.name,
    description: playbook.description,
    rules: playbook.rules,
    createdAt: playbook.createdAt,
    updatedAt: playbook.updatedAt,
    stats: computePlaybookStats(allTrades),
    recentTrades,
  }
}

/**
 * Creates a playbook for the authenticated user.
 */
export async function createPlaybookForUser(
  userId: string,
  data: { name: string; description: string; rules: string }
) {
  return prisma.playbook.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      rules: data.rules,
    },
  })
}

/**
 * Updates a playbook when the user owns it.
 */
export async function updatePlaybookForUser(
  userId: string,
  playbookId: string,
  data: { name: string; description: string; rules: string }
) {
  const existing = await prisma.playbook.findFirst({
    where: { id: playbookId, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.playbook.update({
    where: { id: playbookId },
    data: {
      name: data.name,
      description: data.description,
      rules: data.rules,
    },
  })
}

/**
 * Deletes a playbook and clears playbookId on linked trades via onDelete SetNull.
 */
export async function deletePlaybookForUser(userId: string, playbookId: string) {
  const existing = await prisma.playbook.findFirst({
    where: { id: playbookId, userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.playbook.delete({
    where: { id: playbookId },
  })

  return true
}

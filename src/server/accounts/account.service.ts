import { prisma } from "@/lib/prisma"
import type { AccountListItem, AccountDetail } from "@/types/account"

/**
 * Returns all accounts owned by the user.
 */
export async function listAccountsForUser(userId: string): Promise<AccountListItem[]> {
  const accounts = await prisma.account.findMany({
    where: { userId },
    include: {
      trades: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    currency: account.currency,
    isActive: account.isActive,
    createdAt: account.createdAt,
    hasTrades: account.trades.length > 0,
  }))
}

/**
 * Returns the active account for the user.
 */
export async function getActiveAccountForUser(userId: string): Promise<AccountListItem | null> {
  const account = await prisma.account.findFirst({
    where: { userId, isActive: true },
    include: {
      trades: {
        select: { id: true },
      },
    },
  })
  
  if (!account) {
    return null
  }
  
  return {
    id: account.id,
    name: account.name,
    currency: account.currency,
    isActive: account.isActive,
    createdAt: account.createdAt,
    hasTrades: account.trades.length > 0,
  }
}

/**
 * Creates an account for the authenticated user. First account becomes active automatically.
 */
export async function createAccountForUser(
  userId: string,
  data: { name: string; currency: string }
) {
  const existingAccountsCount = await prisma.account.count({
    where: { userId },
  })

  const isActive = existingAccountsCount === 0

  return prisma.account.create({
    data: {
      userId,
      name: data.name,
      currency: data.currency,
      isActive,
    },
  })
}

/**
 * Updates an account when the user owns it.
 */
export async function updateAccountForUser(
  userId: string,
  accountId: string,
  data: { name: string; currency: string }
) {
  const existing = await prisma.account.findFirst({
    where: { id: accountId, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.account.update({
    where: { id: accountId },
    data: {
      name: data.name,
      currency: data.currency,
    },
  })
}

/**
 * Deletes an account if it has no trades.
 */
export async function deleteAccountForUser(userId: string, accountId: string): Promise<{ success: true } | { success: false; error: string }> {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
    include: { trades: { select: { id: true } } },
  })

  if (!account) {
    return { success: false, error: "Account not found" }
  }

  if (account.trades.length > 0) {
    return { success: false, error: "This account cannot be deleted because it contains trade history" }
  }

  await prisma.account.delete({
    where: { id: accountId },
  })

  return { success: true }
}

/**
 * Sets an account as active, deactivating all others for the user. Uses a transaction.
 */
export async function setActiveAccountForUser(userId: string, accountId: string) {
  const existing = await prisma.account.findFirst({
    where: { id: accountId, userId },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  return prisma.$transaction(async (tx) => {
    await tx.account.updateMany({
      where: { userId },
      data: { isActive: false },
    })

    return tx.account.update({
      where: { id: accountId },
      data: { isActive: true },
    })
  })
}

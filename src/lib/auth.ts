import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

/**
 * Resolves the authenticated Clerk user to an application User record,
 * creating one on first access.
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return null
  }

  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  })
}

/**
 * Returns the authenticated application user or throws when unauthenticated.
 */
export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

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

  // First, try to find the user (read-only)
  let user = await prisma.user.findUnique({
    where: { clerkId },
  })

  // If user doesn't exist, create them (only write when necessary)
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId },
    })
  }

  return user
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

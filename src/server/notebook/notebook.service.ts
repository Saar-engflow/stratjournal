import { prisma } from "@/lib/prisma"
import type { NotebookEntry } from "@/types/notebook"

export async function listNotebookEntriesForUser(
  userId: string
): Promise<NotebookEntry[]> {
  const entries = await prisma.notebookEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })
  return entries
}

export async function getNotebookEntryForUser(
  userId: string,
  entryId: string
): Promise<NotebookEntry | null> {
  return prisma.notebookEntry.findFirst({
    where: { id: entryId, userId }
  })
}

export async function createNotebookEntryForUser(
  userId: string,
  data: { title: string; content: string }
): Promise<NotebookEntry> {
  return prisma.notebookEntry.create({
    data: {
      userId,
      title: data.title,
      content: data.content
    }
  })
}

export async function updateNotebookEntryForUser(
  userId: string,
  entryId: string,
  data: { title: string; content: string }
): Promise<NotebookEntry> {
  const entry = await prisma.notebookEntry.findFirst({
    where: { id: entryId, userId }
  })
  if (!entry) {
    throw new Error("Notebook entry not found")
  }
  return prisma.notebookEntry.update({
    where: { id: entryId },
    data: {
      title: data.title,
      content: data.content
    }
  })
}

export async function deleteNotebookEntryForUser(
  userId: string,
  entryId: string
): Promise<void> {
  const entry = await prisma.notebookEntry.findFirst({
    where: { id: entryId, userId }
  })
  if (!entry) {
    throw new Error("Notebook entry not found")
  }
  await prisma.notebookEntry.delete({
    where: { id: entryId }
  })
}

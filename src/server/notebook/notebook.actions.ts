"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"
import {
  createNotebookEntryForUser,
  updateNotebookEntryForUser,
  deleteNotebookEntryForUser
} from "./notebook.service"
import {
  notebookEntryFormSchema,
  type NotebookEntryFormValues
} from "./notebook.validation"

type ActionResult =
  | { success: true; entryId?: string }
  | { success: false; error: string }

export async function createNotebookEntryAction(
  values: NotebookEntryFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const parsed = notebookEntryFormSchema.safeParse(values)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid entry data"
      }
    }
    const entry = await createNotebookEntryForUser(user.id, parsed.data)
    revalidatePath("/notebook")
    return { success: true, entryId: entry.id }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to create entry" }
  }
}

export async function updateNotebookEntryAction(
  entryId: string,
  values: NotebookEntryFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const parsed = notebookEntryFormSchema.safeParse(values)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid entry data"
      }
    }
    const entry = await updateNotebookEntryForUser(user.id, entryId, parsed.data)
    revalidatePath(`/notebook/${entryId}`)
    revalidatePath("/notebook")
    return { success: true, entryId: entry.id }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to update entry" }
  }
}

export async function deleteNotebookEntryAction(
  entryId: string
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    await deleteNotebookEntryForUser(user.id, entryId)
    revalidatePath("/notebook")
    return { success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to delete entry" }
  }
}

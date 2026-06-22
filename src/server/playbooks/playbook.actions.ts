"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"

import {
  createPlaybookForUser,
  deletePlaybookForUser,
  updatePlaybookForUser,
} from "./playbook.service"
import {
  playbookFormSchema,
  playbookIdSchema,
  type PlaybookFormValues,
} from "./playbook.validation"

type ActionResult =
  | { success: true; playbookId?: string }
  | { success: false; error: string }

/**
 * Creates a new playbook for the authenticated user.
 */
export async function createPlaybookAction(
  values: PlaybookFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const parsed = playbookFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid playbook data",
      }
    }

    const playbook = await createPlaybookForUser(user.id, parsed.data)

    revalidatePath("/playbooks")

    return { success: true, playbookId: playbook.id }
  } catch {
    return { success: false, error: "Failed to create playbook" }
  }
}

/**
 * Updates an existing playbook owned by the authenticated user.
 */
export async function updatePlaybookAction(
  playbookId: string,
  values: PlaybookFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const idParsed = playbookIdSchema.safeParse({ id: playbookId })

    if (!idParsed.success) {
      return { success: false, error: "Invalid playbook ID" }
    }

    const parsed = playbookFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid playbook data",
      }
    }

    const playbook = await updatePlaybookForUser(
      user.id,
      idParsed.data.id,
      parsed.data
    )

    if (!playbook) {
      return { success: false, error: "Playbook not found" }
    }

    revalidatePath("/playbooks")
    revalidatePath(`/playbooks/${playbook.id}`)

    return { success: true, playbookId: playbook.id }
  } catch {
    return { success: false, error: "Failed to update playbook" }
  }
}

/**
 * Deletes a playbook owned by the authenticated user.
 */
export async function deletePlaybookAction(
  playbookId: string
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const idParsed = playbookIdSchema.safeParse({ id: playbookId })

    if (!idParsed.success) {
      return { success: false, error: "Invalid playbook ID" }
    }

    const deleted = await deletePlaybookForUser(user.id, idParsed.data.id)

    if (!deleted) {
      return { success: false, error: "Playbook not found" }
    }

    revalidatePath("/playbooks")

    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete playbook" }
  }
}

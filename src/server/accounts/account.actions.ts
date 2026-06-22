"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"

import {
  createAccountForUser,
  deleteAccountForUser,
  updateAccountForUser,
  setActiveAccountForUser,
} from "./account.service"
import {
  accountFormSchema,
  accountIdSchema,
  type AccountFormValues,
} from "./account.validation"

type ActionResult =
  | { success: true; accountId?: string }
  | { success: false; error: string }

/**
 * Creates a new account for the authenticated user.
 */
export async function createAccountAction(
  values: AccountFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const parsed = accountFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid account data",
      }
    }

    const account = await createAccountForUser(user.id, parsed.data)

    revalidatePath("/accounts")
    revalidatePath("/dashboard")
    revalidatePath("/trades")
    revalidatePath("/calendar")
    revalidatePath("/playbooks")

    return { success: true, accountId: account.id }
  } catch {
    return { success: false, error: "Failed to create account" }
  }
}

/**
 * Updates an existing account owned by the authenticated user.
 */
export async function updateAccountAction(
  accountId: string,
  values: AccountFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const idParsed = accountIdSchema.safeParse({ id: accountId })

    if (!idParsed.success) {
      return { success: false, error: "Invalid account ID" }
    }

    const parsed = accountFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid account data",
      }
    }

    const account = await updateAccountForUser(
      user.id,
      idParsed.data.id,
      parsed.data
    )

    if (!account) {
      return { success: false, error: "Account not found" }
    }

    revalidatePath("/accounts")
    revalidatePath("/dashboard")
    revalidatePath("/trades")
    revalidatePath("/calendar")
    revalidatePath("/playbooks")

    return { success: true, accountId: account.id }
  } catch {
    return { success: false, error: "Failed to update account" }
  }
}

/**
 * Deletes an account owned by the authenticated user if it has no trades.
 */
export async function deleteAccountAction(
  accountId: string
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const idParsed = accountIdSchema.safeParse({ id: accountId })

    if (!idParsed.success) {
      return { success: false, error: "Invalid account ID" }
    }

    const result = await deleteAccountForUser(user.id, idParsed.data.id)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    revalidatePath("/accounts")
    revalidatePath("/dashboard")
    revalidatePath("/trades")
    revalidatePath("/calendar")
    revalidatePath("/playbooks")

    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete account" }
  }
}

/**
 * Sets an account as active.
 */
export async function setActiveAccountAction(
  accountId: string
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const idParsed = accountIdSchema.safeParse({ id: accountId })

    if (!idParsed.success) {
      return { success: false, error: "Invalid account ID" }
    }

    const account = await setActiveAccountForUser(user.id, idParsed.data.id)

    if (!account) {
      return { success: false, error: "Account not found" }
    }

    revalidatePath("/accounts")
    revalidatePath("/dashboard")
    revalidatePath("/trades")
    revalidatePath("/calendar")
    revalidatePath("/playbooks")

    return { success: true, accountId: account.id }
  } catch {
    return { success: false, error: "Failed to switch account" }
  }
}

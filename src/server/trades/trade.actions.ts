"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"

import { createTradeForUser, updateTradeForUser, closeTradeForUser, upsertTradeNoteForUser, uploadTradeImageForUser, deleteTradeImageForUser } from "./trade.service"
import { tradeFormSchema, tradeUpdateFormSchema, closeTradeFormSchema, tradeNoteFormSchema, tradeImageFormSchema, type TradeFormValues, type TradeUpdateFormValues, type CloseTradeFormValues, type TradeNoteFormValues, type TradeImageFormValues } from "./trade.validation"

type ActionResult =
  | { success: true; tradeId?: string; imageId?: string }
  | { success: false; error: string }

export async function createTradeAction(
  values: TradeFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()

    const parsed = tradeFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid trade data",
      }
    }

    const trade = await createTradeForUser(user.id, {
      instrument: parsed.data.instrument,
      direction: parsed.data.direction,
      entryPrice: parseFloat(parsed.data.entryPrice),
      stopLoss: parseFloat(parsed.data.stopLoss),
      takeProfit: parseFloat(parsed.data.takeProfit),
      lotSize: parseFloat(parsed.data.lotSize),
      accountId: parsed.data.accountId,
      playbookId: parsed.data.playbookId,
    })

    revalidatePath("/trades")

    return { success: true, tradeId: trade.id }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to create trade" }
  }
}

export async function updateTradeAction(
  tradeId: string,
  values: TradeUpdateFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()

    const parsed = tradeUpdateFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid trade data",
      }
    }

    const trade = await updateTradeForUser(user.id, tradeId, {
      instrument: parsed.data.instrument,
      direction: parsed.data.direction,
      entryPrice: parseFloat(parsed.data.entryPrice),
      stopLoss: parseFloat(parsed.data.stopLoss),
      takeProfit: parseFloat(parsed.data.takeProfit),
      lotSize: parseFloat(parsed.data.lotSize),
      accountId: parsed.data.accountId,
      playbookId: parsed.data.playbookId,
    })

    revalidatePath("/trades")
    revalidatePath(`/trades/${tradeId}`)

    return { success: true, tradeId: trade.id }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to update trade" }
  }
}

export async function closeTradeAction(
  tradeId: string,
  values: CloseTradeFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()

    const parsed = closeTradeFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid trade data",
      }
    }

    const trade = await closeTradeForUser(
      user.id,
      tradeId,
      parseFloat(parsed.data.profitLoss)
    )

    revalidatePath("/trades")
    revalidatePath(`/trades/${tradeId}`)

    return { success: true, tradeId: trade.id }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to close trade" }
  }
}

export async function saveTradeNoteAction(
  tradeId: string,
  values: TradeNoteFormValues
): Promise<ActionResult> {
  try {
    const user = await requireUser()

    const parsed = tradeNoteFormSchema.safeParse(values)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid note data",
      }
    }

    await upsertTradeNoteForUser(user.id, tradeId, parsed.data.content)

    revalidatePath(`/trades/${tradeId}`)

    return { success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to save note" }
  }
}

export async function uploadTradeImageAction(
  tradeId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireUser()
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file uploaded" }
    }

    const parsed = tradeImageFormSchema.safeParse({ file })

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid file",
      }
    }

    const image = await uploadTradeImageForUser(user.id, tradeId, parsed.data.file)

    revalidatePath(`/trades/${tradeId}`)

    return { success: true, imageId: image.id }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to upload image" }
  }
}

export async function deleteTradeImageAction(
  tradeId: string,
  imageId: string
): Promise<ActionResult> {
  try {
    const user = await requireUser()

    await deleteTradeImageForUser(user.id, tradeId, imageId)

    revalidatePath(`/trades/${tradeId}`)

    return { success: true }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message }
    }
    return { success: false, error: "Failed to delete image" }
  }
}

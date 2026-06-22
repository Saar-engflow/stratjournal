"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"

import { createTradeForUser } from "./trade.service"
import { tradeFormSchema, type TradeFormValues } from "./trade.validation"

type ActionResult =
  | { success: true; tradeId?: string }
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

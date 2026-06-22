import { z } from "zod"

export const tradeFormSchema = z.object({
  instrument: z
    .string()
    .trim()
    .min(3, "Instrument must be at least 3 characters")
    .max(10, "Instrument must be at most 10 characters"),
  direction: z.enum(["BUY", "SELL"], { required_error: "Direction is required" }),
  entryPrice: z
    .string()
    .min(1, "Entry price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Entry price must be a positive number",
    }),
  stopLoss: z
    .string()
    .min(1, "Stop loss is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Stop loss must be a positive number",
    }),
  takeProfit: z
    .string()
    .min(1, "Take profit is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Take profit must be a positive number",
    }),
  lotSize: z
    .string()
    .min(1, "Lot size is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Lot size must be a positive number",
    }),
  accountId: z.string().min(1, "Account is required"),
  playbookId: z.string().optional().nullable(),
})

export const tradeUpdateFormSchema = z.object({
  instrument: z
    .string()
    .trim()
    .min(3, "Instrument must be at least 3 characters")
    .max(10, "Instrument must be at most 10 characters"),
  direction: z.enum(["BUY", "SELL"], { required_error: "Direction is required" }),
  entryPrice: z
    .string()
    .min(1, "Entry price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Entry price must be a positive number",
    }),
  stopLoss: z
    .string()
    .min(1, "Stop loss is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Stop loss must be a positive number",
    }),
  takeProfit: z
    .string()
    .min(1, "Take profit is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Take profit must be a positive number",
    }),
  lotSize: z
    .string()
    .min(1, "Lot size is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Lot size must be a positive number",
    }),
  accountId: z.string().min(1, "Account is required"),
  playbookId: z.string().optional().nullable(),
})

export const closeTradeFormSchema = z.object({
  profitLoss: z
    .string()
    .min(1, "Profit/Loss is required")
    .refine((val) => !isNaN(parseFloat(val)) && isFinite(parseFloat(val)), {
      message: "Profit/Loss must be a valid number",
    }),
})

export type TradeFormValues = z.infer<typeof tradeFormSchema>
export type TradeUpdateFormValues = z.infer<typeof tradeUpdateFormSchema>
export type CloseTradeFormValues = z.infer<typeof closeTradeFormSchema>

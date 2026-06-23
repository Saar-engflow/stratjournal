import { z } from "zod"

export const tradeFormSchema = z.object({
  instrument: z
    .string({ error: "Instrument is required" })
    .trim()
    .min(3, { error: "Instrument must be at least 3 characters" })
    .max(10, { error: "Instrument must be at most 10 characters" }),
  direction: z.enum(["BUY", "SELL"], { error: "Direction is required" }),
  entryPrice: z
    .string({ error: "Entry price is required" })
    .min(1, { error: "Entry price is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Entry price must be a positive number",
    }),
  stopLoss: z
    .string({ error: "Stop loss is required" })
    .min(1, { error: "Stop loss is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Stop loss must be a positive number",
    }),
  takeProfit: z
    .string({ error: "Take profit is required" })
    .min(1, { error: "Take profit is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Take profit must be a positive number",
    }),
  lotSize: z
    .string({ error: "Lot size is required" })
    .min(1, { error: "Lot size is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Lot size must be a positive number",
    }),
  accountId: z.string({ error: "Account is required" }).min(1, { error: "Account is required" }),
  playbookId: z.string().optional().nullable(),
})

export const tradeUpdateFormSchema = z.object({
  instrument: z
    .string({ error: "Instrument is required" })
    .trim()
    .min(3, { error: "Instrument must be at least 3 characters" })
    .max(10, { error: "Instrument must be at most 10 characters" }),
  direction: z.enum(["BUY", "SELL"], { error: "Direction is required" }),
  entryPrice: z
    .string({ error: "Entry price is required" })
    .min(1, { error: "Entry price is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Entry price must be a positive number",
    }),
  stopLoss: z
    .string({ error: "Stop loss is required" })
    .min(1, { error: "Stop loss is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Stop loss must be a positive number",
    }),
  takeProfit: z
    .string({ error: "Take profit is required" })
    .min(1, { error: "Take profit is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Take profit must be a positive number",
    }),
  lotSize: z
    .string({ error: "Lot size is required" })
    .min(1, { error: "Lot size is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      error: "Lot size must be a positive number",
    }),
  accountId: z.string({ error: "Account is required" }).min(1, { error: "Account is required" }),
  playbookId: z.string().optional().nullable(),
})

export const closeTradeFormSchema = z.object({
  profitLoss: z
    .string({ error: "Profit/Loss is required" })
    .min(1, { error: "Profit/Loss is required" })
    .refine((val) => !isNaN(parseFloat(val)) && isFinite(parseFloat(val)), {
      error: "Profit/Loss must be a valid number",
    }),
})

export const tradeNoteFormSchema = z.object({
  content: z.string().max(10000, { error: "Note cannot exceed 10000 characters" }).optional(),
})

export const tradeImageFormSchema = z.object({
  file: z.custom<File>((val) => val instanceof File, {
    error: "File is required",
  })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      error: "File size must be less than 10MB",
    })
    .refine((file) => ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type), {
      error: "Only PNG, JPG, JPEG, and WEBP files are allowed",
    }),
})

export type TradeFormValues = z.infer<typeof tradeFormSchema>
export type TradeUpdateFormValues = z.infer<typeof tradeUpdateFormSchema>
export type CloseTradeFormValues = z.infer<typeof closeTradeFormSchema>
export type TradeNoteFormValues = z.infer<typeof tradeNoteFormSchema>
export type TradeImageFormValues = z.infer<typeof tradeImageFormSchema>

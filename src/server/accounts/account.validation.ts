import { z } from "zod"

export const accountFormSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50, { error: "Name must be at most 50 characters" }),
  currency: z.enum(["USD", "EUR", "GBP", "AUD", "ZAR", "Other"], {
    error: "Currency must be selected",
  }),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

export const accountIdSchema = z.object({
  id: z.string({ error: "Account ID is required" }).min(1, { error: "Account ID is required" }),
})

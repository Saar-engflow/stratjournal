import { z } from "zod"

export const accountFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  currency: z.enum(["USD", "EUR", "GBP", "AUD", "ZAR", "Other"], {
    required_error: "Currency must be selected",
  }),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

export const accountIdSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
})

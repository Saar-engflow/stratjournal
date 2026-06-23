import { z } from "zod"

export const playbookFormSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(3, { error: "Name must be at least 3 characters" })
    .max(100, { error: "Name must be at most 100 characters" }),
  description: z
    .string()
    .trim()
    .max(200, { error: "Description must be at most 200 characters" })
    .optional()
    .or(z.literal("")),
  rules: z
    .array(z.string({ error: "Rule is required" }).trim().min(3, { error: "Each rule must be at least 3 characters" }).max(200, { error: "Each rule must be at most 200 characters" }))
    .min(1, { error: "At least one rule is required" }),
})

export type PlaybookFormValues = z.infer<typeof playbookFormSchema>

export const playbookIdSchema = z.object({
  id: z.string({ error: "Playbook ID is required" }).min(1, { error: "Playbook ID is required" }),
})

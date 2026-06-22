import { z } from "zod"

export const playbookFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  rules: z
    .array(z.string().trim().min(3, "Each rule must be at least 3 characters").max(200, "Each rule must be at most 200 characters"))
    .min(1, "At least one rule is required"),
})

export type PlaybookFormValues = z.infer<typeof playbookFormSchema>

export const playbookIdSchema = z.object({
  id: z.string().min(1, "Playbook ID is required"),
})

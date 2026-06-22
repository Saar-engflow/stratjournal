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
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  rules: z
    .string()
    .trim()
    .min(20, "Rules must be at least 20 characters")
    .max(5000, "Rules must be at most 5000 characters"),
})

export type PlaybookFormValues = z.infer<typeof playbookFormSchema>

export const playbookIdSchema = z.object({
  id: z.string().min(1, "Playbook ID is required"),
})

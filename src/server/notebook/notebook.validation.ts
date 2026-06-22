import { z } from "zod"

export const notebookEntryFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title must be at most 120 characters"),
  content: z.string().trim().min(10, "Content must be at least 10 characters").max(10000, "Content must be at most 10,000 characters")
})

export type NotebookEntryFormValues = z.infer<typeof notebookEntryFormSchema>

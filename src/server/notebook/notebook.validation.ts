import { z } from "zod"

export const notebookEntryFormSchema = z.object({
  title: z.string({ error: "Title is required" }).trim().min(3, { error: "Title must be at least 3 characters" }).max(120, { error: "Title must be at most 120 characters" }),
  content: z.string({ error: "Content is required" }).trim().min(10, { error: "Content must be at least 10 characters" }).max(10000, { error: "Content must be at most 10,000 characters" })
})

export type NotebookEntryFormValues = z.infer<typeof notebookEntryFormSchema>

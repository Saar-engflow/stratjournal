"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { createNotebookEntryAction, updateNotebookEntryAction } from "@/server/notebook/notebook.actions"
import { notebookEntryFormSchema, type NotebookEntryFormValues } from "@/server/notebook/notebook.validation"
import type { NotebookEntry } from "@/types/notebook"

interface NotebookEntryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: NotebookEntry | null
  onSuccess?: (entryId: string) => void
}

export function NotebookEntryFormDialog({
  open,
  onOpenChange,
  entry,
  onSuccess
}: NotebookEntryFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<NotebookEntryFormValues>({
    resolver: zodResolver(notebookEntryFormSchema),
    defaultValues: {
      title: entry?.title || "",
      content: entry?.content || ""
    }
  })

  const handleSubmit = async (values: NotebookEntryFormValues) => {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      let result
      if (entry) {
        result = await updateNotebookEntryAction(entry.id, values)
      } else {
        result = await createNotebookEntryAction(values)
      }
      if (result.success) {
        setSuccess(entry ? "Entry updated successfully" : "Entry created successfully")
        if (result.entryId && onSuccess) {
          onSuccess(result.entryId)
        }
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Edit Note" : "New Note"}
          </DialogTitle>
          <DialogDescription>
            {entry ? "Update your trading notebook entry" : "Create a new trading notebook entry"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 text-red-90 rounded-md text-sm dark:bg-red-950 dark:text-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 text-green-90 rounded-md text-sm dark:bg-green-950 dark:text-green-100">
            {success}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note here..."
                      className="min-h-[200px] resize-y"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (entry ? "Updating..." : "Creating...") : (entry ? "Update" : "Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

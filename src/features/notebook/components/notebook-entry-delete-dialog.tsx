"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { deleteNotebookEntryAction } from "@/server/notebook/notebook.actions"

interface NotebookEntryDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entryId: string
}

export function NotebookEntryDeleteDialog({
  open,
  onOpenChange,
  entryId
}: NotebookEntryDeleteDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteNotebookEntryAction(entryId)
      if (result.success) {
        onOpenChange(false)
        router.push("/notebook")
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="p-3 bg-red-50 text-red-90 rounded-md text-sm dark:bg-red-950 dark:text-red-100">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

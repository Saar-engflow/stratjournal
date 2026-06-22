"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deletePlaybookAction } from "@/server/playbooks/playbook.actions"

type PlaybookDeleteDialogProps = {
  playbookId: string
  playbookName: string
}

/**
 * Confirmation dialog for deleting a playbook.
 */
export function PlaybookDeleteDialog({
  playbookId,
  playbookName,
}: PlaybookDeleteDialogProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    setError(null)

    startTransition(async () => {
      const result = await deletePlaybookAction(playbookId)

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push("/playbooks")
      router.refresh()
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Playbook</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {playbookName}?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Are you sure you want to delete this playbook?
            </span>
            <span className="block">
              Trades linked to this playbook will remain intact, but they will
              no longer reference this playbook.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <p className="text-sm font-medium text-destructive">{error}</p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete Playbook"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

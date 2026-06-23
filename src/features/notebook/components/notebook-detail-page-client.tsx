"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { NotebookEntryFormDialog } from "./notebook-entry-form-dialog"
import { NotebookEntryDeleteDialog } from "./notebook-entry-delete-dialog"
import type { NotebookEntry } from "@/types/notebook"

export function NotebookDetailPageClient({ entry }: { entry: NotebookEntry }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{entry.title}</h1>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(entry.createdAt).toLocaleString()}
              {entry.updatedAt > entry.createdAt && (
                <>
                  <br />
                  Last updated: {new Date(entry.updatedAt).toLocaleString()}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <Card>
          <CardContent className="pt-6">
            <div className="whitespace-pre-wrap leading-relaxed">
              {entry.content}
            </div>
          </CardContent>
        </Card>

        <NotebookEntryFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          entry={entry}
          onSuccess={() => setIsEditOpen(false)}
        />

        <NotebookEntryDeleteDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          entryId={entry.id}
        />
      </div>
    </div>
  )
}

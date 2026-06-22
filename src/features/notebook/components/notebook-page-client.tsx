"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotebookEntryFormDialog } from "./notebook-entry-form-dialog"
import type { NotebookEntry } from "@/types/notebook"

export function NotebookPageClient({ entries }: { entries: NotebookEntry[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const getPreview = (content: string) => {
    if (content.length <= 150) return content
    return content.slice(0, 147) + "..."
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notebook</h1>
        <Button onClick={() => setIsFormOpen(true)}>New Note</Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="text-muted-foreground text-lg">
            No notes yet.
          </div>
          <div className="text-muted-foreground">
            Create your first trading notebook entry.
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/notebook/${entry.id}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-lg">
                    {entry.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {getPreview(entry.content)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <NotebookEntryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={(entryId) => {
          setIsFormOpen(false)
          router.push(`/notebook/${entryId}`)
        }}
      />
    </div>
  )
}

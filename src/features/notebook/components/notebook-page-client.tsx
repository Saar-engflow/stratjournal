"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotebookEntryFormDialog } from "./notebook-entry-form-dialog"
import { exportNotebookAction } from "@/server/export/export.actions"
import type { NotebookEntry } from "@/types/notebook"

function downloadFile(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function NotebookPageClient({ entries }: { entries: NotebookEntry[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleExportNotebook = async () => {
    setIsExporting(true)
    setError(null)
    try {
      const result = await exportNotebookAction()
      if (result.success) {
        downloadFile(result.csv, result.filename)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Unable to generate export. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const getPreview = (content: string) => {
    if (content.length <= 150) return content
    return content.slice(0, 147) + "..."
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Notebook</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportNotebook} disabled={isExporting}>
            {isExporting ? "Generating export..." : "Export Notebook"}
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>New Note</Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

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

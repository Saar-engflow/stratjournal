"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { exportTradesAction } from "@/server/export/export.actions"
import { exportNotebookAction } from "@/server/export/export.actions"

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

export function ExportButtons() {
  const [isExportingTrades, setIsExportingTrades] = useState(false)
  const [isExportingNotebook, setIsExportingNotebook] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExportTrades = async () => {
    setIsExportingTrades(true)
    setError(null)
    try {
      const result = await exportTradesAction()
      if (result.success) {
        downloadFile(result.csv, result.filename)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Unable to generate export. Please try again.')
    } finally {
      setIsExportingTrades(false)
    }
  }

  const handleExportNotebook = async () => {
    setIsExportingNotebook(true)
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
      setIsExportingNotebook(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {error && (
        <div className="w-full p-4 bg-destructive/10 text-destructive rounded-md mb-2">
          {error}
        </div>
      )}
      <Button variant="secondary" onClick={handleExportTrades} disabled={isExportingTrades}>
        {isExportingTrades ? "Generating export..." : "Export Trades"}
      </Button>
      <Button variant="secondary" onClick={handleExportNotebook} disabled={isExportingNotebook}>
        {isExportingNotebook ? "Generating export..." : "Export Notebook"}
      </Button>
    </div>
  )
}

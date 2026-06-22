"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PlaybookCard } from "@/features/playbooks/components/playbook-card"
import { PlaybookFormDialog } from "@/features/playbooks/components/playbook-form-dialog"
import type { PlaybookListItem } from "@/types/playbook"

type PlaybooksPageClientProps = {
  playbooks: PlaybookListItem[]
}

/**
 * Client wrapper for the playbooks list page with create dialog.
 */
export function PlaybooksPageClient({ playbooks }: PlaybooksPageClientProps) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playbooks</h1>
          <p className="text-muted-foreground mt-1">
            Document and track your trading strategies.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Playbook
        </Button>
      </div>

      {playbooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">No playbooks created yet.</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Create your first strategy playbook.
          </p>
          <Button onClick={() => setCreateOpen(true)} className="mt-6">
            <Plus className="h-4 w-4" />
            Create Playbook
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {playbooks.map((playbook) => (
            <PlaybookCard key={playbook.id} playbook={playbook} />
          ))}
        </div>
      )}

      <PlaybookFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />
    </div>
  )
}

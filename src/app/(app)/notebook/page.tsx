import { requireUser } from "@/lib/auth"
import { listNotebookEntriesForUser } from "@/server/notebook/notebook.service"
import { NotebookPageClient } from "@/features/notebook/components/notebook-page-client"

export default async function NotebookPage() {
  const user = await requireUser()
  const entries = await listNotebookEntriesForUser(user.id)
  return <NotebookPageClient entries={entries} />
}

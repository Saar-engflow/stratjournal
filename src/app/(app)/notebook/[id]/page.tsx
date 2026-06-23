import { requireUser } from "@/lib/auth"
import { getNotebookEntryForUser } from "@/server/notebook/notebook.service"
import { NotebookDetailPageClient } from "@/features/notebook/components/notebook-detail-page-client"
import { notFound } from "next/navigation"

export default async function NotebookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const entry = await getNotebookEntryForUser(user.id, id)
  if (!entry) {
    notFound()
  }
  return <NotebookDetailPageClient entry={entry} />
}

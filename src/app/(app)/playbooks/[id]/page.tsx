import { notFound } from "next/navigation"

import { PlaybookDetailView } from "@/features/playbooks/components/playbook-detail-view"
import { requireUser } from "@/lib/auth"
import { getPlaybookForUser } from "@/server/playbooks/playbook.service"

type PlaybookDetailPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Playbook detail page — shows strategy info and derived trade statistics.
 */
export default async function PlaybookDetailPage({
  params,
}: PlaybookDetailPageProps) {
  const { id } = await params
  const user = await requireUser()
  const playbook = await getPlaybookForUser(user.id, id)

  if (!playbook) {
    notFound()
  }

  return <PlaybookDetailView playbook={playbook} />
}

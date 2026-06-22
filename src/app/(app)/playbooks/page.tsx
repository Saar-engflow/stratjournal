import { PlaybooksPageClient } from "@/features/playbooks/components/playbooks-page-client"
import { listPlaybooksForUser } from "@/server/playbooks/playbook.service"
import { requireUser } from "@/lib/auth"

/**
 * Playbooks list page — displays all playbooks for the authenticated user.
 */
export default async function PlaybooksPage() {
  const user = await requireUser()
  const playbooks = await listPlaybooksForUser(user.id)

  return <PlaybooksPageClient playbooks={playbooks} />
}

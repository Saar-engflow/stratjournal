import { requireUser } from "@/lib/auth"
import { listAccountsForUser } from "@/server/accounts/account.service"
import { listPlaybooksForUser } from "@/server/playbooks/playbook.service"

import { TradeForm } from "@/features/trades/components/trade-form"

type NewTradePageProps = {
  searchParams: Promise<{ playbookId?: string }>
}

export default async function NewTradePage({ searchParams }: NewTradePageProps) {
  const { playbookId } = await searchParams
  const user = await requireUser()
  const accounts = await listAccountsForUser(user.id)
  const playbooks = await listPlaybooksForUser(user.id)

  return (
    <TradeForm
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      playbooks={playbooks.map((p) => ({ id: p.id, name: p.name }))}
      preSelectedPlaybookId={playbookId}
    />
  )
}

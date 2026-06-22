import { notFound, redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"
import { getTradeForUser } from "@/server/trades/trade.service"
import { listAccountsForUser } from "@/server/accounts/account.service"
import { listPlaybooksForUser } from "@/server/playbooks/playbook.service"

import { TradeForm } from "@/features/trades/components/trade-form"

export default async function EditTradePage({ params }: { params: { id: string } }) {
  const user = await requireUser()
  const trade = await getTradeForUser(user.id, params.id)

  if (!trade) {
    notFound()
  }

  if (trade.status === "CLOSED") {
    redirect(`/trades/${trade.id}`)
  }

  const accounts = await listAccountsForUser(user.id)
  const playbooks = await listPlaybooksForUser(user.id)

  return (
    <TradeForm
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      playbooks={playbooks.map((p) => ({ id: p.id, name: p.name }))}
      trade={trade}
      isEdit
    />
  )
}

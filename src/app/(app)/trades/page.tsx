import { requireUser } from "@/lib/auth"
import { getActiveAccountForUser } from "@/server/accounts/account.service"
import { listTradesForUser } from "@/server/trades/trade.service"

import { TradesPageClient } from "@/features/trades/components/trades-page-client"

export default async function TradesPage() {
  const user = await requireUser()
  const activeAccount = await getActiveAccountForUser(user.id);
  const trades = await listTradesForUser(user.id, activeAccount?.id)

  return <TradesPageClient trades={trades} />
}

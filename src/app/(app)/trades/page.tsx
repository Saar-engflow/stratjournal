import { requireUser } from "@/lib/auth"
import { listTradesForUser } from "@/server/trades/trade.service"

import { TradesPageClient } from "@/features/trades/components/trades-page-client"

export default async function TradesPage() {
  const user = await requireUser()
  const trades = await listTradesForUser(user.id)

  return <TradesPageClient trades={trades} />
}

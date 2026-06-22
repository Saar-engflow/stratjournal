import { notFound, redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"
import { getTradeForUser } from "@/server/trades/trade.service"

import { CloseTradeForm } from "@/features/trades/components/close-trade-form"

export default async function CloseTradePage({ params }: { params: { id: string } }) {
  const user = await requireUser()
  const trade = await getTradeForUser(user.id, params.id)

  if (!trade) {
    notFound()
  }

  if (trade.status === "CLOSED") {
    redirect(`/trades/${trade.id}`)
  }

  return <CloseTradeForm trade={trade} />
}

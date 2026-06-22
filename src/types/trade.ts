export type TradeListItem = {
  id: string
  instrument: string
  direction: "BUY" | "SELL"
  entryPrice: number
  stopLoss: number
  takeProfit: number
  lotSize: number
  status: "OPEN" | "CLOSED"
  profitLoss: number | null
  account: { id: string; name: string }
  playbook: { id: string; name: string } | null
  createdAt: Date
  closedAt: Date | null
}

export type TradeDetail = {
  id: string
  instrument: string
  direction: "BUY" | "SELL"
  entryPrice: number
  stopLoss: number
  takeProfit: number
  lotSize: number
  status: "OPEN" | "CLOSED"
  profitLoss: number | null
  account: { id: string; name: string; currency: string }
  playbook: { id: string; name: string } | null
  userId: string
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
}

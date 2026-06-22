export type PlaybookStats = {
  tradeCount: number
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  netProfitLoss: number
}

export type PlaybookListItem = {
  id: string
  name: string
  description: string
  createdAt: Date
  stats: PlaybookStats
}

export type PlaybookTradeSummary = {
  id: string
  instrument: string
  direction: "LONG" | "SHORT"
  status: "OPEN" | "CLOSED"
  profitLoss: number | null
  createdAt: Date
  result: string
}

export type PlaybookDetail = {
  id: string
  name: string
  description: string
  rules: string
  createdAt: Date
  updatedAt: Date
  stats: PlaybookStats
  recentTrades: PlaybookTradeSummary[]
}

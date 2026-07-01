import { prisma } from "@/lib/prisma";

export async function getCalendarData(userId: string, accountId?: string) {
  const where: any = { userId };
  if (accountId) {
    where.accountId = accountId;
  }

  // Fetch ALL trades and notes (no date filter)
  const trades = await prisma.trade.findMany({
    where,
    include: { note: true },
    orderBy: { createdAt: "desc" },
  });

  // Group trades by date (YYYY-MM-DD)
  const dayMap = new Map<string, {
    profitLoss: number;
    tradesCount: number;
    hasNotes: boolean;
    trades: typeof trades;
  }>();

  // Helper to get local date key in YYYY-MM-DD format
  const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  for (const trade of trades) {
    const dateKey = trade.closedAt
      ? getLocalDateKey(trade.closedAt)
      : getLocalDateKey(trade.createdAt);

    const existing = dayMap.get(dateKey) || {
      profitLoss: 0,
      tradesCount: 0,
      hasNotes: false,
      trades: [],
    };

    // Only add profit/loss for closed trades
    let pl = existing.profitLoss;
    if (trade.status === "CLOSED" && trade.profitLoss !== null) {
      pl += Number(trade.profitLoss);
    }

    dayMap.set(dateKey, {
      profitLoss: pl,
      tradesCount: existing.tradesCount + 1,
      hasNotes: existing.hasNotes || (trade.note !== null),
      trades: [...existing.trades, trade],
    });
  }

  // Convert map to array of days
  const days = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    profitLoss: data.profitLoss,
    tradesCount: data.tradesCount,
    hasNotes: data.hasNotes,
    trades: data.trades.map((trade) => ({
      ...trade,
      entryPrice: Number(trade.entryPrice),
      stopLoss: Number(trade.stopLoss),
      takeProfit: Number(trade.takeProfit),
      lotSize: Number(trade.lotSize),
      profitLoss: trade.profitLoss !== null ? Number(trade.profitLoss) : null,
    })),
    notes: data.trades
      .filter((trade) => trade.note)
      .map((trade) => trade.note!),
  }));

  return { days };
}

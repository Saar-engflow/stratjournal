import { prisma } from "@/lib/prisma";

export async function getCalendarData(userId: string, month: number, year: number, accountId?: string) {
  // Get start and end of the month
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const where: any = { userId };
  if (accountId) {
    where.accountId = accountId;
  }

  // Fetch all trades and notes for the month
  const trades = await prisma.trade.findMany({
    where: {
      ...where,
      OR: [
        { closedAt: { gte: startDate, lte: endDate } },
        { createdAt: { gte: startDate, lte: endDate } },
      ],
    },
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

  for (const trade of trades) {
    const dateKey = trade.closedAt
      ? trade.closedAt.toISOString().split("T")[0]
      : trade.createdAt.toISOString().split("T")[0];

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

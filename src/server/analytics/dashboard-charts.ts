import { prisma } from "@/lib/prisma";

export async function getChartData(userId: string, accountId?: string) {
  const where: any = { userId };
  if (accountId) {
    where.accountId = accountId;
  }
  
  const closedTrades = await prisma.trade.findMany({
    where: { ...where, status: "CLOSED" },
    select: {
      id: true,
      instrument: true,
      direction: true,
      profitLoss: true,
      closedAt: true,
    },
    orderBy: { closedAt: "asc" },
  });

  let cumulative = 0;
  const performance = closedTrades.map((trade) => {
    const profitLoss = Number(trade.profitLoss ?? 0);
    cumulative += profitLoss;
    return {
      date: trade.closedAt?.toISOString().split("T")[0] ?? new Date().toISOString().split("T")[0],
      profitLoss,
      cumulative,
    };
  });

  const wins = closedTrades.filter((t) => t.profitLoss && Number(t.profitLoss) > 0).length;
  const losses = closedTrades.filter((t) => t.profitLoss && Number(t.profitLoss) < 0).length;
  const trend = [
    { name: "Wins", count: wins },
    { name: "Losses", count: losses },
  ];

  const recentTrades = await prisma.trade.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      account: { select: { id: true, name: true } },
      playbook: { select: { id: true, name: true } },
    },
  }).then((trades) =>
    trades.map((trade) => ({
      ...trade,
      entryPrice: Number(trade.entryPrice),
      stopLoss: Number(trade.stopLoss),
      takeProfit: Number(trade.takeProfit),
      lotSize: Number(trade.lotSize),
      profitLoss: trade.profitLoss !== null ? Number(trade.profitLoss) : null,
    }))
  );

  return {
    performance,
    recentTrades,
    trend,
  };
}

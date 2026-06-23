import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics(userId: string, accountId?: string) {
  const where: any = { userId };
  if (accountId) {
    where.accountId = accountId;
  }
  
  const trades = await prisma.trade.findMany({
    where,
    select: {
      status: true,
      profitLoss: true,
    },
  });

  const totalTrades = trades.length;
  const openTrades = trades.filter((t) => t.status === "OPEN").length;
  const closedTrades = trades.filter((t) => t.status === "CLOSED").length;
  const winningTrades = trades.filter(
    (t) => t.status === "CLOSED" && t.profitLoss && Number(t.profitLoss) > 0
  ).length;
  const winRate = closedTrades === 0 ? 0 : (winningTrades / closedTrades) * 100;
  const netProfitLoss = trades
    .filter((t) => t.status === "CLOSED" && t.profitLoss !== null)
    .reduce((sum, t) => sum + Number(t.profitLoss), 0);

  return {
    totalTrades,
    openTrades,
    closedTrades,
    winRate,
    netProfitLoss,
  };
}

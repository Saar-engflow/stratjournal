import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { generateCSV } from './csv';
import type { ExportResult } from './export.actions';

export async function exportTrades(): Promise<ExportResult> {
  const user = await requireUser();
  const activeAccount = await prisma.account.findFirst({
    where: { userId: user.id, isActive: true }
  });

  const trades = await prisma.trade.findMany({
    where: {
      userId: user.id,
      accountId: activeAccount?.id
    },
    include: {
      account: true,
      playbook: true
    },
    orderBy: { createdAt: 'desc' }
  });

  if (trades.length === 0) {
    return { success: false, error: 'No trades available to export.' };
  }

  const columns = [
    'Trade ID',
    'Account Name',
    'Playbook Name',
    'Instrument',
    'Direction',
    'Entry Price',
    'Stop Loss',
    'Take Profit',
    'Lot Size',
    'Status',
    'Profit/Loss',
    'Created At',
    'Closed At'
  ];

  const data = trades.map(trade => [
    trade.id,
    trade.account.name,
    trade.playbook?.name || '',
    trade.instrument,
    trade.direction,
    trade.entryPrice.toString(),
    trade.stopLoss.toString(),
    trade.takeProfit.toString(),
    trade.lotSize.toString(),
    trade.status,
    trade.profitLoss?.toString() || '',
    trade.createdAt.toISOString(),
    trade.closedAt?.toISOString() || ''
  ]);

  const csv = generateCSV(data, columns);

  const today = new Date();
  const filename = `trades-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.csv`;

  return {
    success: true,
    csv,
    filename
  };
}

'use client';

import { InstallPrompt } from './InstallPrompt';

export function DashboardInstallPrompt({ hasClosedTrades }: { hasClosedTrades: boolean }) {
  return <InstallPrompt hasClosedTrades={hasClosedTrades} />;
}

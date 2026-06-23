'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/lib/pwa/useInstallPrompt';

export function InstallPrompt({ hasClosedTrades }: { hasClosedTrades: boolean }) {
  const { isPromptVisible, isInstalled, showPrompt, install, dismiss, isEligible } = useInstallPrompt();
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  useEffect(() => {
    if (hasClosedTrades && isEligible() && !hasShownPrompt && !isInstalled) {
      showPrompt();
      setHasShownPrompt(true);
    }
  }, [hasClosedTrades, isEligible, isInstalled, hasShownPrompt, showPrompt]);

  if (isInstalled || !isPromptVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Install StratJournal</h3>
          <p className="text-sm text-muted-foreground">Get the app for a better experience</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={dismiss}>Maybe Later</Button>
          <Button onClick={install}>Install App</Button>
        </div>
      </div>
    </div>
  );
}

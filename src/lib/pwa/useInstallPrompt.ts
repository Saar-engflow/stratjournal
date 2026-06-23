'use client';

import { useState, useEffect } from 'react';

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsPromptVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showPrompt = () => {
    if (prompt) {
      setIsPromptVisible(true);
    }
  };

  const install = async () => {
    if (!prompt) return;
    const { outcome } = await prompt.prompt();
    if (outcome === 'accepted') {
      setIsPromptVisible(false);
      setPrompt(null);
    }
  };

  const dismiss = () => {
    setIsPromptVisible(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  const isEligible = () => {
    return prompt && !isInstalled && localStorage.getItem('installPromptDismissed') !== 'true';
  };

  return {
    isPromptVisible,
    isInstalled,
    showPrompt,
    install,
    dismiss,
    isEligible,
  };
}

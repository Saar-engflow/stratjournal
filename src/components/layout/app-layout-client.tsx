"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { BottomNav } from "./bottom-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { AccountSwitcher } from "@/features/accounts/components/account-switcher"
import { OnboardingModal } from "@/features/accounts/components/onboarding-modal"
import { createAccountAction, setActiveAccountAction } from "@/server/accounts/account.actions"
import type { AccountListItem } from "@/types/account"

interface AppLayoutClientProps {
  children: React.ReactNode
  accounts: AccountListItem[]
  activeAccount: AccountListItem | null
}

export function AppLayoutClient({ children, accounts, activeAccount }: AppLayoutClientProps) {
  const [key, setKey] = useState(0)
  const hasAccounts = accounts.length > 0

  function handleSuccess() {
    setKey((k) => k + 1)
  }

  return (
    <div key={key} className="flex min-h-screen bg-background">
      <Sidebar accounts={accounts} activeAccount={activeAccount} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b gap-2 bg-background sticky top-0 z-30">
          <div className="flex-1 max-w-[200px]">
            {hasAccounts && (
              <AccountSwitcher
                accounts={accounts}
                activeAccount={activeAccount}
                onSetActive={setActiveAccountAction}
                onCreate={createAccountAction}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          {children}
        </main>
      </div>
      <BottomNav accounts={accounts} activeAccount={activeAccount} />
      {!hasAccounts && (
        <OnboardingModal
          open
          onSubmit={createAccountAction}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

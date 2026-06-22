"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AccountFormDialog } from "./account-form-dialog"
import type { AccountListItem } from "@/types/account"

interface AccountSwitcherProps {
  accounts: AccountListItem[]
  activeAccount: AccountListItem | null
  onSetActive: (accountId: string) => Promise<{ success: boolean; error?: string }>
  onCreate: (values: any) => Promise<{ success: boolean; error?: string }>
}

export function AccountSwitcher({ accounts, activeAccount, onSetActive, onCreate }: AccountSwitcherProps) {
  const [isSwitching, setIsSwitching] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  async function handleSetActive(accountId: string) {
    setIsSwitching(accountId)
    await onSetActive(accountId)
    setIsSwitching(null)
  }

  function handleSuccess() {
    setKey((k) => k + 1)
  }

  if (!activeAccount) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">No account</span>
      </div>
    )
  }

  return (
    <div key={key}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="w-full justify-start">
            {activeAccount.name}
            <span className="ml-auto text-xs text-muted-foreground">
              {activeAccount.currency}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {accounts.map((account) => (
            <DropdownMenuItem
              key={account.id}
              onClick={() => handleSetActive(account.id)}
              disabled={isSwitching !== null || account.isActive}
            >
              <div className="flex items-center gap-2">
                {account.isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                {!account.isActive && <div className="w-2 h-2 rounded-full" />}
                <div className="flex-1">
                  {account.name}
                  <div className="text-xs text-muted-foreground">{account.currency}</div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <AccountFormDialog
              onSubmit={onCreate}
              onSuccess={handleSuccess}
              trigger={
                <Button variant="ghost" className="w-full justify-start p-0">
                  Create New Account
                </Button>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

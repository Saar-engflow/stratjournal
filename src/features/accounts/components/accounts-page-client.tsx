"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { AccountCard } from "./account-card"
import { AccountFormDialog } from "./account-form-dialog"
import type { AccountListItem } from "@/types/account"
import {
  createAccountAction,
  updateAccountAction,
  deleteAccountAction,
  setActiveAccountAction,
} from "@/server/accounts/account.actions"

interface AccountsPageClientProps {
  accounts: AccountListItem[]
}

export function AccountsPageClient({ accounts }: AccountsPageClientProps) {
  const [key, setKey] = useState(0)

  function handleSuccess() {
    setKey((k) => k + 1)
  }

  if (accounts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>No trading accounts yet</CardTitle>
            <CardDescription>
              Create your first trading account to start tracking trades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountFormDialog
              onSubmit={createAccountAction}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading Accounts</h1>
          <p className="text-muted-foreground">
            Manage your trading accounts and switch between them.
          </p>
        </div>
        <AccountFormDialog
          onSubmit={createAccountAction}
          onSuccess={handleSuccess}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" key={key}>
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={(values) => updateAccountAction(account.id, values)}
            onDelete={() => deleteAccountAction(account.id)}
            onSetActive={() => setActiveAccountAction(account.id)}
          />
        ))}
      </div>
    </div>
  )
}
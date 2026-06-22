"use client"

import { useState } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

import { AccountFormDialog } from "./account-form-dialog"
import { AccountDeleteDialog } from "./account-delete-dialog"
import type { AccountListItem } from "@/types/account"

interface AccountCardProps {
  account: AccountListItem
  onEdit: (values: any) => Promise<{ success: boolean; error?: string }>
  onDelete: () => Promise<{ success: boolean; error?: string }>
  onSetActive: () => Promise<{ success: boolean; error?: string }>
}

export function AccountCard({ account, onEdit, onDelete, onSetActive }: AccountCardProps) {
  const [isActivating, setIsActivating] = useState(false)

  async function handleSetActive() {
    setIsActivating(true)
    await onSetActive()
    setIsActivating(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={account.isActive ? "default" : "secondary"}>
              {account.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">{account.currency}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created {format(new Date(account.createdAt), "MMM d, yyyy")}
        </p>
        {account.hasTrades && (
          <p className="mt-1 text-xs text-muted-foreground">
            Cannot delete - has trade history
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {!account.isActive && (
          <Button variant="secondary" size="sm" onClick={handleSetActive} disabled={isActivating}>
            {isActivating ? "Activating..." : "Set Active"}
          </Button>
        )}
        <AccountFormDialog
          trigger={<Button variant="secondary" size="sm">Edit</Button>}
          account={account}
          onSubmit={onEdit}
        />
        <AccountDeleteDialog
          hasTrades={account.hasTrades}
          onDelete={onDelete}
        />
      </CardFooter>
    </Card>
  )
}
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlaybookDeleteDialog } from "@/features/playbooks/components/playbook-delete-dialog"
import { PlaybookFormDialog } from "@/features/playbooks/components/playbook-form-dialog"
import {
  formatDate,
  formatProfitLoss,
  formatWinRate,
} from "@/lib/format"
import type { PlaybookDetail } from "@/types/playbook"

type PlaybookDetailViewProps = {
  playbook: PlaybookDetail
}

/**
 * Client view for playbook detail with edit and delete actions.
 */
export function PlaybookDetailView({ playbook }: PlaybookDetailViewProps) {
  const [editOpen, setEditOpen] = useState(false)
  const { stats } = playbook

  const pnlClass =
    stats.netProfitLoss > 0
      ? "text-green-600 dark:text-green-400"
      : stats.netProfitLoss < 0
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit px-0 hover:bg-transparent">
          <Link href="/playbooks">
            <ArrowLeft className="h-4 w-4" />
            Back to Playbooks
          </Link>
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{playbook.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Created {formatDate(playbook.createdAt)} · Updated{" "}
              {formatDate(playbook.updatedAt)}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit Playbook
            </Button>
            <PlaybookDeleteDialog
              playbookId={playbook.id}
              playbookName={playbook.name}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Strategy Information</CardTitle>
            <CardDescription>
              Reference details for this trading strategy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {playbook.description && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {playbook.description}
                </p>
              </div>
            )}
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-4">Rules</h3>
              <ul className="space-y-2">
                {playbook.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-1 h-4 w-4 border rounded-sm" />
                    <span className="text-sm text-muted-foreground">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Statistics</CardTitle>
            <CardDescription>Derived from linked trades.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Total Trades" value={String(stats.tradeCount)} />
              <StatItem label="Wins" value={String(stats.wins)} />
              <StatItem label="Losses" value={String(stats.losses)} />
              <StatItem label="Win Rate" value={formatWinRate(stats.winRate)} />
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Net Profit/Loss</p>
              <p className={`text-2xl font-semibold ${pnlClass}`}>
                {formatProfitLoss(stats.netProfitLoss)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Trades</CardTitle>
          <CardDescription>
            Latest trades linked to this playbook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {playbook.recentTrades.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No trades linked to this playbook yet.
            </p>
          ) : (
            <div className="space-y-3">
              {playbook.recentTrades.map((trade) => {
                const resultVariant =
                  trade.result === "Win"
                    ? "success"
                    : trade.result === "Loss"
                      ? "danger"
                      : trade.result === "Open"
                        ? "warning"
                        : "secondary"

                return (
                  <div
                    key={trade.id}
                    className="flex flex-col gap-2 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{trade.instrument}</p>
                      <p className="text-sm text-muted-foreground">
                        {trade.direction} · {formatDate(trade.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={resultVariant}>{trade.result}</Badge>
                      {trade.status === "CLOSED" && trade.profitLoss !== null ? (
                        <span
                          className={
                            trade.profitLoss > 0
                              ? "text-sm font-medium text-green-600 dark:text-green-400"
                              : trade.profitLoss < 0
                                ? "text-sm font-medium text-red-600 dark:text-red-400"
                                : "text-sm font-medium text-muted-foreground"
                          }
                        >
                          {formatProfitLoss(trade.profitLoss)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {editOpen ? (
        <PlaybookFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          mode="edit"
          playbookId={playbook.id}
          defaultValues={{
            name: playbook.name,
            description: playbook.description || "",
            rules: playbook.rules,
          }}
        />
      ) : null}
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  )
}

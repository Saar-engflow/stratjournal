"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatDate,
  formatProfitLoss,
  formatWinRate,
  truncateText,
} from "@/lib/format"
import type { PlaybookListItem } from "@/types/playbook"

type PlaybookCardProps = {
  playbook: PlaybookListItem
}

/**
 * Summary card for a playbook on the list page.
 */
export function PlaybookCard({ playbook }: PlaybookCardProps) {
  const { stats } = playbook
  const pnlVariant =
    stats.netProfitLoss > 0
      ? "success"
      : stats.netProfitLoss < 0
        ? "danger"
        : "secondary"

  return (
    <Link href={`/playbooks/${playbook.id}`} className="block h-full">
      <Card className="h-full transition-colors hover:border-green-600/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">{playbook.name}</CardTitle>
            <div className="flex gap-1">
              <Badge variant="outline">{stats.tradeCount} trades</Badge>
              <Badge variant="outline">{playbook.rules.length} rules</Badge>
            </div>
          </div>
          {playbook.description && (
            <CardDescription>
              {truncateText(playbook.description, 120)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Win rate {formatWinRate(stats.winRate)}
            </Badge>
            <Badge variant={pnlVariant}>
              {formatProfitLoss(stats.netProfitLoss)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Created {formatDate(playbook.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface DayData {
  date: string;
  profitLoss: number;
  tradesCount: number;
  hasNotes: boolean;
  trades: any[]; // We can refine this type later
  notes: any[];
}

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayData | null;
}

export function DayModal({ isOpen, onClose, dayData }: DayModalProps) {
  if (!dayData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {new Date(dayData.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Daily summary */}
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={`text-lg ${
                dayData.profitLoss > 0
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : dayData.profitLoss < 0
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : ""
              }`}
            >
              {dayData.profitLoss > 0 ? "+" : ""}
              {dayData.profitLoss.toFixed(2)}
            </Badge>
            <span className="text-muted-foreground">
              {dayData.tradesCount} trade{dayData.tradesCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Trades */}
          <div className="space-y-2">
            <h3 className="font-semibold">Trades</h3>
            {dayData.trades.map((trade) => (
              <Card key={trade.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{trade.instrument}</div>
                    <div className="text-sm text-muted-foreground">
                      {trade.direction} ·{" "}
                      {trade.status === "CLOSED" ? "Closed" : "Open"}
                    </div>
                  </div>
                  <div className="text-right">
                    {trade.status === "CLOSED" && trade.profitLoss !== null && (
                      <div
                        className={`font-medium ${
                          trade.profitLoss > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {trade.profitLoss > 0 ? "+" : ""}
                        {trade.profitLoss.toFixed(2)}
                      </div>
                    )}
                    <Link
                      href={`/trades/${trade.id}`}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notes */}
          {dayData.notes.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              {dayData.notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    {note.content}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

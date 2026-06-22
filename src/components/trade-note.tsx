"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { saveTradeNoteAction } from "@/server/trades/trade.actions"
import { tradeNoteFormSchema, type TradeNoteFormValues } from "@/server/trades/trade.validation"
import type { TradeNote as TradeNoteType, TradeDetail } from "@/types/trade"

export function TradeNote({
  trade,
}: {
  trade: TradeDetail
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<TradeNoteFormValues>({
    resolver: zodResolver(tradeNoteFormSchema),
    defaultValues: {
      content: trade.note?.content || "",
    },
  })

  async function onSubmit(values: TradeNoteFormValues) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const result = await saveTradeNoteAction(trade.id, values)
      if (result.success) {
        setSuccess("Note saved successfully")
      } else {
        setError(result.error)
      }
    })
  }

  const isEditable = trade.status === "OPEN"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trade Note</CardTitle>
          {!isEditable && (
            <Badge variant="secondary">Read-only</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-90 rounded-md text-sm dark:bg-red-950 dark:text-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-90 rounded-md text-sm dark:bg-green-950 dark:text-green-100">
            {success}
          </div>
        )}
        {isEditable ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Add a note about this trade..."
                        className="min-h-[150px] resize-none"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Note"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="min-h-[150px]">
            {trade.note?.content ? (
              <p className="whitespace-pre-wrap">{trade.note.content}</p>
            ) : (
              <p className="text-muted-foreground">No notes added for this trade yet.</p>
            )}
            {trade.note?.updatedAt && (
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date(trade.note.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

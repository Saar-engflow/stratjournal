"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ArrowLeftIcon } from "lucide-react"

import { closeTradeAction } from "@/server/trades/trade.actions"
import { closeTradeFormSchema, type CloseTradeFormValues } from "@/server/trades/trade.validation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TradeDetail } from "@/types/trade"

interface CloseTradeFormProps {
  trade: TradeDetail
}

export function CloseTradeForm({ trade }: CloseTradeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CloseTradeFormValues>({
    resolver: zodResolver(closeTradeFormSchema),
    defaultValues: {
      profitLoss: "",
    },
  })

  function onSubmit(values: CloseTradeFormValues) {
    setError(null)
    startTransition(async () => {
      const result = await closeTradeAction(trade.id, values)

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push(`/trades/${trade.id}`)
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/trades/${trade.id}`}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Close Trade</CardTitle>
          <CardDescription>Record the final profit/loss for this trade</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Instrument</p>
              <p className="font-medium">{trade.instrument}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Direction</p>
              <p className="font-medium">{trade.direction}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Entry Price</p>
              <p className="font-medium">{trade.entryPrice.toFixed(5)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lot Size</p>
              <p className="font-medium">{trade.lotSize.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-90 rounded-md text-sm dark:bg-red-950 dark:text-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="profitLoss">Profit/Loss *</Label>
                <FormField
                  control={form.control}
                  name="profitLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter final profit/loss"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between sticky bottom-0 bg-background border-t pt-4">
              <Button variant="ghost" type="button" asChild>
                <Link href={`/trades/${trade.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Closing..." : "Close Trade"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

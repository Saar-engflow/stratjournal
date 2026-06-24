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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ArrowLeftIcon } from "lucide-react"

import { createTradeAction, updateTradeAction } from "@/server/trades/trade.actions"
import { tradeFormSchema, tradeUpdateFormSchema, type TradeFormValues, type TradeUpdateFormValues } from "@/server/trades/trade.validation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TradeDetail } from "@/types/trade"

interface AccountOption {
  id: string
  name: string
}

interface PlaybookOption {
  id: string
  name: string
}

interface TradeFormProps {
  accounts: AccountOption[]
  playbooks: PlaybookOption[]
  trade?: TradeDetail
  isEdit?: boolean
  preSelectedPlaybookId?: string
}

export function TradeForm({ accounts, playbooks, trade, isEdit = false, preSelectedPlaybookId }: TradeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TradeFormValues | TradeUpdateFormValues>({
    resolver: zodResolver(isEdit ? tradeUpdateFormSchema : tradeFormSchema),
    defaultValues: trade
      ? {
          instrument: trade.instrument,
          direction: trade.direction,
          entryPrice: trade.entryPrice.toString(),
          stopLoss: trade.stopLoss.toString(),
          takeProfit: trade.takeProfit.toString(),
          lotSize: trade.lotSize.toString(),
          accountId: trade.account.id,
          playbookId: trade.playbook ? trade.playbook.id : null,
        }
      : {
          instrument: "",
          direction: "BUY",
          entryPrice: "",
          stopLoss: "",
          takeProfit: "",
          lotSize: "",
          accountId: "",
          playbookId: preSelectedPlaybookId || null,
        },
  })

  function onSubmit(values: TradeFormValues | TradeUpdateFormValues) {
    setError(null)
    startTransition(async () => {
      let result
      if (isEdit && trade) {
        result = await updateTradeAction(trade.id, values as TradeUpdateFormValues)
      } else {
        result = await createTradeAction(values as TradeFormValues)
      }

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push(trade ? `/trades/${trade.id}` : "/trades")
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href={trade ? `/trades/${trade.id}` : "/trades"}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Trade" : "New Trade"}</CardTitle>
          <CardDescription>{isEdit ? "Update trade details" : "Log a new trade entry"}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-90 rounded-md text-sm dark:bg-red-950 dark:text-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="accountId">Account *</Label>
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="playbookId">Playbook (Optional)</Label>
                <FormField
                  control={form.control}
                  name="playbookId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={(val) => field.onChange(val || null)}
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a playbook (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {playbooks.map((playbook) => (
                              <SelectItem key={playbook.id} value={playbook.id}>
                                {playbook.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instrument">Instrument *</Label>
                <FormField
                  control={form.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="e.g. XAUUSD, EURUSD"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction *</Label>
                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUY">BUY</SelectItem>
                            <SelectItem value="SELL">SELL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price (in pips) *</Label>
                  <FormField
                    control={form.control}
                    name="entryPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss *</Label>
                  <FormField
                    control={form.control}
                    name="stopLoss"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit *</Label>
                  <FormField
                    control={form.control}
                    name="takeProfit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size *</Label>
                <FormField
                  control={form.control}
                  name="lotSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="0.01"
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
                <Link href={trade ? `/trades/${trade.id}` : "/trades"}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Trade")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

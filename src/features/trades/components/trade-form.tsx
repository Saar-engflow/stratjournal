"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

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

import { createTradeAction } from "@/server/trades/trade.actions"
import { tradeFormSchema, type TradeFormValues } from "@/server/trades/trade.validation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
}

export function TradeForm({ accounts, playbooks }: TradeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      instrument: "",
      direction: "BUY",
      entryPrice: "",
      stopLoss: "",
      takeProfit: "",
      lotSize: "",
      accountId: "",
      playbookId: null,
    },
  })

  function onSubmit(values: TradeFormValues) {
    setError(null)
    startTransition(async () => {
      const result = await createTradeAction(values)

      if (!result.success) {
        setError(result.error)
        return
      }

      router.push("/trades")
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Trade</CardTitle>
          <CardDescription>Log a new trade entry</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-900 rounded-md text-sm dark:bg-red-950 dark:text-red-100">
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
                  <Label htmlFor="entryPrice">Entry Price *</Label>
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

            <CardFooter className="flex justify-end sticky bottom-0 bg-background border-t pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Trade"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

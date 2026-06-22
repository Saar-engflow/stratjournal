"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createPlaybookAction,
  updatePlaybookAction,
} from "@/server/playbooks/playbook.actions"
import {
  playbookFormSchema,
  type PlaybookFormValues,
} from "@/server/playbooks/playbook.validation"

type PlaybookFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  playbookId?: string
  defaultValues?: PlaybookFormValues
}

/**
 * Dialog form for creating or editing a playbook.
 */
export function PlaybookFormDialog({
  open,
  onOpenChange,
  mode,
  playbookId,
  defaultValues,
}: PlaybookFormDialogProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<PlaybookFormValues>({
    resolver: zodResolver(playbookFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      rules: "",
    },
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(
        defaultValues ?? {
          name: "",
          description: "",
          rules: "",
        }
      )
      setError(null)
    }

    onOpenChange(nextOpen)
  }

  const onSubmit = (values: PlaybookFormValues) => {
    setError(null)

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createPlaybookAction(values)
          : await updatePlaybookAction(playbookId!, values)

      if (!result.success) {
        setError(result.error)
        return
      }

      form.reset()
      handleOpenChange(false)

      if (mode === "create" && result.playbookId) {
        router.push(`/playbooks/${result.playbookId}`)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Playbook" : "Edit Playbook"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Document a reusable trading strategy you can link to trades."
              : "Update your strategy details. Historical trade records remain unchanged."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playbook Name</FormLabel>
                  <FormControl>
                    <Input placeholder="London Breakout" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="High-level explanation of the strategy"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed checklist and execution criteria"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error ? (
              <p className="text-sm font-medium text-destructive">{error}</p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Playbook"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

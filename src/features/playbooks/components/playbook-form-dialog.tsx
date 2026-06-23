"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, type FieldPath, type FieldValues } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"

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
 * Dialog form for creating or editing a playbook with checklist rules.
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
      rules: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  } as unknown as any)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(
        defaultValues ?? {
          name: "",
          description: "",
          rules: [],
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Rules</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append("")}
                >
                  <Plus className="h-4 w-4" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`rules.${index}`}
                      render={({ field: ruleField }) => (
                        <FormItem className="flex-1 mb-0">
                          <FormControl>
                            <Input
                              placeholder={`Rule ${index + 1}`}
                              {...ruleField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {form.formState.errors.rules && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.rules.message ||
                    "Please add at least one valid rule"}
                </p>
              )}
            </div>

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

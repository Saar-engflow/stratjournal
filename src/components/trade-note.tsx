"use client"

import { useState, useTransition, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

import { saveTradeNoteAction, uploadTradeImageAction, deleteTradeImageAction } from "@/server/trades/trade.actions"
import { tradeNoteFormSchema, type TradeNoteFormValues } from "@/server/trades/trade.validation"
import type { TradeNote as TradeNoteType, TradeDetail, TradeImage as TradeImageType } from "@/types/trade"

export function TradeNote({
  trade,
}: {
  trade: TradeDetail
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<TradeImageType | null>(null)
  const [imageToDelete, setImageToDelete] = useState<TradeImageType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadTradeImageAction(trade.id, formData)
    if (result.success) {
      setSuccess("Image uploaded successfully")
    } else {
      setError(result.error)
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleDeleteImage(imageId: string) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const result = await deleteTradeImageAction(trade.id, imageId)
      if (result.success) {
        setSuccess("Image deleted successfully")
      } else {
        setError(result.error)
      }
      setImageToDelete(null)
    })
  }

  const isEditable = trade.status === "OPEN"
  const images = trade.note?.images || []

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trade Note</CardTitle>
            {!isEditable && (
              <Badge variant="secondary">Read-only</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {isEditable && (
            <div>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
              )}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={`Trade image uploaded at ${new Date(image.uploadedAt).toLocaleString()}`}
                    className="w-full h-40 object-cover rounded-md cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  {isEditable && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImageToDelete(image)
                        }}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {new Date(image.uploadedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription className="hidden">
            Image preview for trade {trade.id}
          </DialogDescription>
          {selectedImage && (
            <img
              src={selectedImage.url}
              alt={`Trade image uploaded at ${new Date(selectedImage.uploadedAt).toLocaleString()}`}
              className="w-full h-auto rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The image will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                if (imageToDelete) {
                  handleDeleteImage(imageToDelete.id)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

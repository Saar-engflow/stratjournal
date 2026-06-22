"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { AccountFormDialog } from "./account-form-dialog"

interface OnboardingModalProps {
  open: boolean
  onSubmit: (values: any) => Promise<{ success: boolean; error?: string }>
  onSuccess: () => void
}

export function OnboardingModal({ open, onSubmit, onSuccess }: OnboardingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to StratJournal</DialogTitle>
          <DialogDescription>
            Create your first trading account to start tracking trades.
          </DialogDescription>
        </DialogHeader>
        <AccountFormDialog
          onSubmit={onSubmit}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}

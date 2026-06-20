'use client'

import { SignUp } from '@clerk/nextjs'
import { AuthLayout } from '@/components/auth/auth-layout'

export default function SignUpPage() {
  return (
    <AuthLayout
      title=""
      subtitle=""
      alternateLinkText="Already have an account?"
      alternateLinkHref="/sign-in"
    >
      <style>{`
        .cl-socialButtonsBlockButton__appleIcon,
        .cl-socialButtonsIconButton__appleIcon,
        .cl-socialButtonsIconButton__icon,
        .cl-socialButtonsBlockButton__icon {
          display: inline-flex !important;
          opacity: 1 !important;
          visibility: visible !important;
          color: inherit !important;
          width: 20px !important;
          height: 20px !important;
        }
      `}</style>
      <SignUp
        appearance={{
          elements: {
            rootBox: 'shadow-xl rounded-xl bg-background p-0',
            card: 'shadow-none border-0 bg-transparent',
            form: 'p-0',
            header: 'hidden',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtons: 'flex flex-col gap-3 mb-6',
            socialButtonsBlockButton: 'flex items-center justify-center gap-3 h-12 px-4 rounded-md border border-border bg-muted/40 hover:bg-muted/60 transition-colors shadow-sm',
            socialButtonsBlockButtonText: 'text-sm font-medium text-foreground',
            socialButtonsBlockButtonIcon: 'w-5 h-5 flex-shrink-0',
            dividerLine: 'h-px bg-border',
            dividerText: 'text-muted-foreground font-medium',
            formField: 'mb-4',
            formFieldLabel: 'text-sm font-medium text-foreground mb-1.5',
            formFieldInput: 'h-12 bg-muted/50 border border-border/60 shadow-sm focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-0 rounded-md text-sm',
            formButtonPrimary: 'h-12 bg-[#16A34A] hover:bg-[#15803D] text-white font-medium shadow-md hover:shadow-lg transition-all rounded-md mt-2',
            formButtonReset: 'shadow-sm',
            footer: 'hidden',
          },
        }}
      />
    </AuthLayout>
  )
}

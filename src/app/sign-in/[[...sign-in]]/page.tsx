'use client'

import { SignIn } from '@clerk/nextjs'
import { AuthLayout } from '@/components/auth/auth-layout'

export default function SignInPage() {
  return (
    <AuthLayout
      title=""
      subtitle=""
      alternateLinkText="Don't have an account?"
      alternateLinkHref="/sign-up"
    >
      <SignIn
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
            socialButtonsBlockButtonIcon: 'w-5 h-5 flex-shrink-0 text-foreground',
            dividerLine: 'h-px bg-border',
            dividerText: 'text-muted-foreground font-medium',
            formField: 'mb-4',
            formFieldLabel: 'text-sm font-medium text-foreground mb-1.5',
            formFieldInput: 'h-12 bg-background border-2 border-input focus:ring-2 focus:ring-ring focus:border-ring rounded-md text-sm shadow-sm',
            formButtonPrimary: 'h-12 bg-[#16A34A] hover:bg-[#15803D] text-white font-medium shadow-md hover:shadow-lg transition-all rounded-md mt-2',
            formButtonReset: 'shadow-sm',
            footer: 'hidden',
          },
        }}
      />
    </AuthLayout>
  )
}

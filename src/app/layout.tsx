import type { Metadata } from "next"
import "@fontsource-variable/manrope"
import "./globals.css"
import "@clerk/ui/themes/shadcn.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"

export const metadata: Metadata = {
  title: "StratJournal",
  description: "Trading journal and strategy manager",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StratJournal",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: "/icon-logo.png",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icon-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  
                  let resolvedTheme = theme;
                  if (theme === 'system') {
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  root.classList.add(resolvedTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            elements: {
              // Profile button
              userButtonPopoverCard: "bg-card border border-border shadow-xl",
              userButtonPopoverActions: "border-t border-border",
              userButtonPopoverActionButton: "hover:bg-accent",
              userButtonAvatarBox: "border border-border",
              userButtonTrigger: "border border-border hover:border-border/80",
              userButtonPopoverFooter: "border-t border-border",
              
              // Popups & Modals
              popover: "bg-card border border-border shadow-xl",
              popoverCard: "bg-card border border-border shadow-xl",
              modal: "bg-card border border-border shadow-xl",
              modalBackdrop: "bg-black/50",
              modalOverlay: "bg-black/50",
              
              // Navbar & Sidebar
              navbar: "bg-card border border-border",
              organizationSwitcherTrigger: "border border-border",
              organizationSwitcherPopoverCard: "bg-card border border-border shadow-xl",
              
              // Account Management (right panel)
              pageScrollBox: "bg-background",
              page: "bg-background",
              pageHeader: "bg-card border border-border",
              pageHeaderTitle: "text-foreground",
              pageHeaderSubtitle: "text-muted-foreground",
              
              // Form elements
              formFieldInput: "bg-muted border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              formButtonSecondary: "bg-muted text-foreground hover:bg-muted/80",
              formButtonReset: "bg-muted text-foreground hover:bg-muted/80",
              
              // Cards & Containers
              card: "bg-card border border-border shadow-sm",
              section: "bg-card border border-border shadow-sm",
              
              // Tabs
              tab: "text-muted-foreground hover:text-foreground",
              tabActive: "text-foreground border-b border-primary",
              
              // Profile Image
              avatarBox: "border border-border",
              profileSection: "bg-card border border-border shadow-sm",
            },
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Provides the top-level application layout.
 *
 * Wraps content with a sidebar, bottom navigation, and a mobile-only theme toggle.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile header with theme toggle */}
        <header className="md:hidden flex justify-end p-4 border-b">
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

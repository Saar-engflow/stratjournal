import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with theme toggle and user button */}
        <header className="md:hidden flex justify-end p-4 border-b gap-2 items-center bg-background sticky top-0 z-30">
          <ThemeToggle />
          <UserButton />
        </header>
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, Calendar, FileText, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AccountListItem } from "@/types/account"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/trades", label: "Trades", icon: TrendingUp },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/notebook", label: "Notebook", icon: FileText },
  { href: "/playbooks", label: "Playbooks", icon: BookOpen },
]

interface BottomNavProps {
  accounts: AccountListItem[]
  activeAccount: AccountListItem | null
}

/**
 * Renders a fixed bottom navigation bar for mobile devices with active route highlighting.
 */
export function BottomNav({ accounts, activeAccount }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card p-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/playbooks" && (pathname === "/playbooks" || pathname === "/accounts"))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

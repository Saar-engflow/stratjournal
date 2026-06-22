"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Home,
  TrendingUp,
  BookOpen,
  CreditCard,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { AccountSwitcher } from "@/features/accounts/components/account-switcher"
import {
  createAccountAction,
  setActiveAccountAction,
} from "@/server/accounts/account.actions"
import type { AccountListItem } from "@/types/account"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/trades", label: "Trades", icon: TrendingUp },
  { href: "/playbooks", label: "Playbooks", icon: BookOpen },
  { href: "/accounts", label: "Accounts", icon: CreditCard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/notebook", label: "Notebook", icon: FileText },
]

interface SidebarProps {
  accounts: AccountListItem[]
  activeAccount: AccountListItem | null
}

export function Sidebar({ accounts, activeAccount }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      <aside
        className={cn(
          "border-r bg-card h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col hidden md:flex z-40",
          isCollapsed ? "w-16 p-2" : "w-64 p-4"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && <h1 className="text-xl font-bold">StratJournal</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isCollapsed ? "justify-center" : "",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        <div className={cn("mt-auto pt-4 space-y-2", isCollapsed ? "flex flex-col items-center" : "")}>
          {!isCollapsed && (
            <AccountSwitcher
              accounts={accounts}
              activeAccount={activeAccount}
              onSetActive={setActiveAccountAction}
              onCreate={createAccountAction}
            />
          )}
          <ThemeToggle />
          <UserButton />
        </div>
      </aside>
      {/* Spacer to prevent layout shift - only on desktop */}
      <div className={cn("transition-all duration-300 hidden md:block flex-shrink-0", isCollapsed ? "w-16" : "w-64")} />
    </>
  )
}

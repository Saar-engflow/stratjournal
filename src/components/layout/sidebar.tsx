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

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/trades", label: "Trades", icon: TrendingUp },
  { href: "/playbooks", label: "Playbooks", icon: BookOpen },
  { href: "/accounts", label: "Accounts", icon: CreditCard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/notebook", label: "Notebook", icon: FileText },
]

/**
 * Renders a responsive, collapsible sidebar with navigation links.
 *
 * The sidebar displays navigation items, highlights the active route, and supports toggling between collapsed (icon-only) and expanded (with labels) states. It includes a theme toggle at the bottom and is hidden on mobile screens.
 */
export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      <aside
        className={cn(
          "border-r bg-card h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col hidden md:flex",
          isCollapsed ? "w-16 p-2" : "w-64 p-4"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && <h1 className="text-xl font-bold">StratJournal</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
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
        <div className={cn("mt-auto pt-4", isCollapsed ? "flex justify-center" : "")}>
          <ThemeToggle />
        </div>
      </aside>
      {/* Spacer to prevent layout shift - only on desktop */}
      <div className={cn("transition-all duration-300 hidden md:block", isCollapsed ? "w-16" : "w-64")} />
    </>
  )
}

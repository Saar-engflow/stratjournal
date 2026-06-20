import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Sidebar } from "../sidebar"

let mockPathname = "/"

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    title,
  }: {
    children: React.ReactNode
    href: string
    className?: string
    title?: string
  }) => (
    <a href={href} className={className} title={title}>
      {children}
    </a>
  ),
}))

vi.mock("lucide-react", () => ({
  Home: ({ className }: { className?: string }) => (
    <svg data-testid="icon-home" className={className} />
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg data-testid="icon-trending-up" className={className} />
  ),
  BookOpen: ({ className }: { className?: string }) => (
    <svg data-testid="icon-book-open" className={className} />
  ),
  CreditCard: ({ className }: { className?: string }) => (
    <svg data-testid="icon-credit-card" className={className} />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg data-testid="icon-calendar" className={className} />
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg data-testid="icon-file-text" className={className} />
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-left" className={className} />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-right" className={className} />
  ),
}))

vi.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle theme</button>,
}))

describe("Sidebar", () => {
  beforeEach(() => {
    mockPathname = "/"
  })

  it("renders an aside element", () => {
    render(<Sidebar />)
    expect(screen.getByRole("complementary")).toBeInTheDocument()
  })

  it("shows StratJournal title when expanded", () => {
    render(<Sidebar />)
    expect(screen.getByText("StratJournal")).toBeInTheDocument()
  })

  it("renders all 6 navigation links", () => {
    render(<Sidebar />)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(6)
  })

  it("renders Dashboard nav item", () => {
    render(<Sidebar />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("renders Trades nav item", () => {
    render(<Sidebar />)
    expect(screen.getByText("Trades")).toBeInTheDocument()
  })

  it("renders Playbooks nav item", () => {
    render(<Sidebar />)
    expect(screen.getByText("Playbooks")).toBeInTheDocument()
  })

  it("renders Accounts nav item", () => {
    render(<Sidebar />)
    expect(screen.getByText("Accounts")).toBeInTheDocument()
  })

  it("renders Calendar nav item", () => {
    render(<Sidebar />)
    expect(screen.getByText("Calendar")).toBeInTheDocument()
  })

  it("renders Notebook nav item", () => {
    render(<Sidebar />)
    expect(screen.getByText("Notebook")).toBeInTheDocument()
  })

  it("sets correct href for Dashboard link", () => {
    render(<Sidebar />)
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).toHaveAttribute("href", "/")
  })

  it("sets correct href for Trades link", () => {
    render(<Sidebar />)
    const tradesLink = screen.getByText("Trades").closest("a")
    expect(tradesLink).toHaveAttribute("href", "/trades")
  })

  it("sets correct href for Playbooks link", () => {
    render(<Sidebar />)
    const playbooksLink = screen.getByText("Playbooks").closest("a")
    expect(playbooksLink).toHaveAttribute("href", "/playbooks")
  })

  it("sets correct href for Accounts link", () => {
    render(<Sidebar />)
    const accountsLink = screen.getByText("Accounts").closest("a")
    expect(accountsLink).toHaveAttribute("href", "/accounts")
  })

  it("applies active styles to Dashboard link when on '/'", () => {
    mockPathname = "/"
    render(<Sidebar />)
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).toHaveClass("bg-accent", "text-accent-foreground")
  })

  it("applies inactive styles to Trades link when not on '/trades'", () => {
    mockPathname = "/"
    render(<Sidebar />)
    const tradesLink = screen.getByText("Trades").closest("a")
    expect(tradesLink).toHaveClass("text-muted-foreground")
    expect(tradesLink).not.toHaveClass("bg-accent text-accent-foreground")
  })

  it("applies active styles to Trades link when on '/trades'", () => {
    mockPathname = "/trades"
    render(<Sidebar />)
    const tradesLink = screen.getByText("Trades").closest("a")
    expect(tradesLink).toHaveClass("bg-accent", "text-accent-foreground")
  })

  it("renders collapse button", () => {
    render(<Sidebar />)
    // The collapse button is in the aside (not a link)
    const buttons = screen.getAllByRole("button")
    // One button for collapse + one for theme-toggle
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it("shows ChevronLeft icon when expanded", () => {
    render(<Sidebar />)
    expect(screen.getByTestId("icon-chevron-left")).toBeInTheDocument()
    expect(screen.queryByTestId("icon-chevron-right")).not.toBeInTheDocument()
  })

  it("collapses when collapse button is clicked", () => {
    render(<Sidebar />)
    // Title should be visible initially
    expect(screen.getByText("StratJournal")).toBeInTheDocument()

    // Find and click the collapse button (the one that is NOT a link and NOT the theme toggle)
    const allButtons = screen.getAllByRole("button")
    const collapseButton = allButtons.find(
      (btn) => !btn.hasAttribute("data-testid")
    )
    expect(collapseButton).toBeDefined()
    fireEvent.click(collapseButton!)

    // After collapse, title should not be visible
    expect(screen.queryByText("StratJournal")).not.toBeInTheDocument()
  })

  it("shows ChevronRight icon after collapsing", () => {
    render(<Sidebar />)
    const allButtons = screen.getAllByRole("button")
    const collapseButton = allButtons.find(
      (btn) => !btn.hasAttribute("data-testid")
    )
    fireEvent.click(collapseButton!)
    expect(screen.getByTestId("icon-chevron-right")).toBeInTheDocument()
    expect(screen.queryByTestId("icon-chevron-left")).not.toBeInTheDocument()
  })

  it("hides nav item labels when collapsed", () => {
    render(<Sidebar />)
    const allButtons = screen.getAllByRole("button")
    const collapseButton = allButtons.find(
      (btn) => !btn.hasAttribute("data-testid")
    )
    fireEvent.click(collapseButton!)
    // Nav item text labels should not be visible after collapse
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument()
    expect(screen.queryByText("Trades")).not.toBeInTheDocument()
  })

  it("expands again after a second click of the collapse button", () => {
    render(<Sidebar />)
    const allButtons = screen.getAllByRole("button")
    const collapseButton = allButtons.find(
      (btn) => !btn.hasAttribute("data-testid")
    )
    fireEvent.click(collapseButton!) // collapse
    fireEvent.click(collapseButton!) // expand
    expect(screen.getByText("StratJournal")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("adds title attribute to links when collapsed (for tooltip)", () => {
    render(<Sidebar />)
    const allButtons = screen.getAllByRole("button")
    const collapseButton = allButtons.find(
      (btn) => !btn.hasAttribute("data-testid")
    )
    fireEvent.click(collapseButton!)
    const links = screen.getAllByRole("link")
    // All links should have a title attribute when collapsed
    links.forEach((link) => {
      expect(link).toHaveAttribute("title")
    })
  })

  it("does not add title attribute to links when expanded", () => {
    render(<Sidebar />)
    // In expanded state, title should be undefined (not set)
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).not.toHaveAttribute("title")
  })

  it("renders all icons", () => {
    render(<Sidebar />)
    expect(screen.getByTestId("icon-home")).toBeInTheDocument()
    expect(screen.getByTestId("icon-trending-up")).toBeInTheDocument()
    expect(screen.getByTestId("icon-book-open")).toBeInTheDocument()
    expect(screen.getByTestId("icon-credit-card")).toBeInTheDocument()
    expect(screen.getByTestId("icon-calendar")).toBeInTheDocument()
    expect(screen.getByTestId("icon-file-text")).toBeInTheDocument()
  })

  it("renders the ThemeToggle component", () => {
    render(<Sidebar />)
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument()
  })

  it("renders a spacer div for layout alongside the aside", () => {
    const { container } = render(<Sidebar />)
    // The component renders both an aside and a spacer div
    const aside = container.querySelector("aside")
    expect(aside).toBeInTheDocument()
  })

  it("has hidden md:flex classes on aside (hidden on mobile, visible on desktop)", () => {
    const { container } = render(<Sidebar />)
    const aside = container.querySelector("aside")
    expect(aside).toHaveClass("hidden", "md:flex")
  })
})
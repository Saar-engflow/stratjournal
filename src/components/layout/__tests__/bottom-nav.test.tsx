import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { BottomNav } from "../bottom-nav"

let mockPathname = "/"

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} className={className}>
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
  Calendar: ({ className }: { className?: string }) => (
    <svg data-testid="icon-calendar" className={className} />
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg data-testid="icon-file-text" className={className} />
  ),
  MoreHorizontal: ({ className }: { className?: string }) => (
    <svg data-testid="icon-more-horizontal" className={className} />
  ),
}))

describe("BottomNav", () => {
  beforeEach(() => {
    mockPathname = "/"
  })

  it("renders a nav element", () => {
    render(<BottomNav />)
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })

  it("renders all 5 navigation items", () => {
    render(<BottomNav />)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(5)
  })

  it("renders Dashboard link", () => {
    render(<BottomNav />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("renders Trades link", () => {
    render(<BottomNav />)
    expect(screen.getByText("Trades")).toBeInTheDocument()
  })

  it("renders Calendar link", () => {
    render(<BottomNav />)
    expect(screen.getByText("Calendar")).toBeInTheDocument()
  })

  it("renders Notebook link", () => {
    render(<BottomNav />)
    expect(screen.getByText("Notebook")).toBeInTheDocument()
  })

  it("renders More link for playbooks/accounts overflow", () => {
    render(<BottomNav />)
    expect(screen.getByText("More")).toBeInTheDocument()
  })

  it("sets correct href attributes for all nav items", () => {
    render(<BottomNav />)
    const links = screen.getAllByRole("link")
    const hrefs = links.map((l) => l.getAttribute("href"))
    expect(hrefs).toContain("/")
    expect(hrefs).toContain("/trades")
    expect(hrefs).toContain("/calendar")
    expect(hrefs).toContain("/notebook")
    expect(hrefs).toContain("/playbooks")
  })

  it("applies active class to Dashboard link when on '/'", () => {
    mockPathname = "/"
    render(<BottomNav />)
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).toHaveClass("text-foreground")
    expect(dashboardLink).not.toHaveClass("text-muted-foreground")
  })

  it("applies inactive class to non-active links when on '/'", () => {
    mockPathname = "/"
    render(<BottomNav />)
    const tradesLink = screen.getByText("Trades").closest("a")
    expect(tradesLink).toHaveClass("text-muted-foreground")
    expect(tradesLink).not.toHaveClass("text-foreground")
  })

  it("applies active class to Trades link when on '/trades'", () => {
    mockPathname = "/trades"
    render(<BottomNav />)
    const tradesLink = screen.getByText("Trades").closest("a")
    expect(tradesLink).toHaveClass("text-foreground")
  })

  it("applies active class to Calendar link when on '/calendar'", () => {
    mockPathname = "/calendar"
    render(<BottomNav />)
    const calendarLink = screen.getByText("Calendar").closest("a")
    expect(calendarLink).toHaveClass("text-foreground")
  })

  it("applies active class to More when on '/playbooks'", () => {
    mockPathname = "/playbooks"
    render(<BottomNav />)
    const moreLink = screen.getByText("More").closest("a")
    expect(moreLink).toHaveClass("text-foreground")
  })

  it("applies active class to More when on '/accounts' (overflow behavior)", () => {
    mockPathname = "/accounts"
    render(<BottomNav />)
    const moreLink = screen.getByText("More").closest("a")
    expect(moreLink).toHaveClass("text-foreground")
  })

  it("does not apply active class to More when on an unrelated path", () => {
    mockPathname = "/trades"
    render(<BottomNav />)
    const moreLink = screen.getByText("More").closest("a")
    expect(moreLink).toHaveClass("text-muted-foreground")
  })

  it("renders all expected icons", () => {
    render(<BottomNav />)
    expect(screen.getByTestId("icon-home")).toBeInTheDocument()
    expect(screen.getByTestId("icon-trending-up")).toBeInTheDocument()
    expect(screen.getByTestId("icon-calendar")).toBeInTheDocument()
    expect(screen.getByTestId("icon-file-text")).toBeInTheDocument()
    expect(screen.getByTestId("icon-more-horizontal")).toBeInTheDocument()
  })

  it("has correct fixed positioning classes on nav", () => {
    render(<BottomNav />)
    const nav = screen.getByRole("navigation")
    expect(nav).toHaveClass("fixed", "bottom-0", "left-0", "right-0")
  })

  it("has md:hidden class to hide on desktop", () => {
    render(<BottomNav />)
    const nav = screen.getByRole("navigation")
    expect(nav).toHaveClass("md:hidden")
  })

  it("Dashboard link remains inactive when on a different page", () => {
    mockPathname = "/notebook"
    render(<BottomNav />)
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).toHaveClass("text-muted-foreground")
  })
})
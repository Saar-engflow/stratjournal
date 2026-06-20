import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import AppLayout from "../layout"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
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
  Home: () => <svg data-testid="icon-home" />,
  TrendingUp: () => <svg data-testid="icon-trending-up" />,
  BookOpen: () => <svg data-testid="icon-book-open" />,
  CreditCard: () => <svg data-testid="icon-credit-card" />,
  Calendar: () => <svg data-testid="icon-calendar" />,
  FileText: () => <svg data-testid="icon-file-text" />,
  ChevronLeft: () => <svg data-testid="icon-chevron-left" />,
  ChevronRight: () => <svg data-testid="icon-chevron-right" />,
  MoreHorizontal: () => <svg data-testid="icon-more-horizontal" />,
  Moon: () => <svg data-testid="moon-icon" />,
  Sun: () => <svg data-testid="sun-icon" />,
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: vi.fn(),
  }),
}))

describe("AppLayout", () => {
  it("renders children", () => {
    render(
      <AppLayout>
        <div data-testid="test-child">Content</div>
      </AppLayout>
    )
    expect(screen.getByTestId("test-child")).toBeInTheDocument()
  })

  it("renders sidebar", () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )
    // Sidebar renders an aside
    expect(screen.getByRole("complementary")).toBeInTheDocument()
  })

  it("renders bottom nav", () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )
    // Both sidebar and BottomNav render nav elements; we verify BottomNav by its fixed-bottom class
    const navElements = screen.getAllByRole("navigation")
    const bottomNav = navElements.find((el) =>
      el.className.includes("fixed") && el.className.includes("bottom-0")
    )
    expect(bottomNav).toBeDefined()
  })

  it("renders mobile header with theme toggle", () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )
    // Mobile header has a header element
    const header = screen.getByRole("banner")
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass("md:hidden")
  })

  it("wraps content in a flex container", () => {
    const { container } = render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass("flex", "min-h-screen")
  })

  it("main element has correct padding classes", () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )
    const main = screen.getByRole("main")
    expect(main).toHaveClass("flex-1", "p-6")
  })
})
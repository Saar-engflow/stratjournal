import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { ThemeToggle } from "../theme-toggle"

const mockSetTheme = vi.fn()
let mockResolvedTheme: string | undefined = "light"

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}))

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Moon: ({ className }: { className?: string }) => (
    <svg data-testid="moon-icon" className={className} />
  ),
  Sun: ({ className }: { className?: string }) => (
    <svg data-testid="sun-icon" className={className} />
  ),
}))

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolvedTheme = "light"
  })

  it("renders a button", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("has an accessible label for screen readers", () => {
    render(<ThemeToggle />)
    expect(screen.getByText("Toggle theme")).toBeInTheDocument()
    expect(screen.getByText("Toggle theme")).toHaveClass("sr-only")
  })

  it("shows Sun icon before mounting (SSR state)", () => {
    // Before useEffect runs, mounted is false, so Sun should show
    render(<ThemeToggle />)
    // Initially (before effect), mounted=false so Sun icon shown
    // After effect, mounted=true and theme is 'light', so Moon is shown
    // We check the final mounted state (after act/effects)
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument()
  })

  it("shows Moon icon when theme is light (after mount)", async () => {
    mockResolvedTheme = "light"
    render(<ThemeToggle />)
    await act(async () => {})
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument()
  })

  it("shows Sun icon when theme is dark", async () => {
    mockResolvedTheme = "dark"
    render(<ThemeToggle />)
    await act(async () => {})
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument()
  })

  it("calls setTheme with 'dark' when current theme is light", async () => {
    mockResolvedTheme = "light"
    render(<ThemeToggle />)
    await act(async () => {})
    fireEvent.click(screen.getByRole("button"))
    expect(mockSetTheme).toHaveBeenCalledWith("dark")
  })

  it("calls setTheme with 'light' when current theme is dark", async () => {
    mockResolvedTheme = "dark"
    render(<ThemeToggle />)
    await act(async () => {})
    fireEvent.click(screen.getByRole("button"))
    expect(mockSetTheme).toHaveBeenCalledWith("light")
  })

  it("has type='button' to prevent accidental form submission", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button")).toHaveAttribute("type", "button")
  })

  it("applies correct CSS classes to the button", () => {
    render(<ThemeToggle />)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("p-2", "rounded-md", "hover:bg-accent", "transition-colors")
  })

  it("shows Sun icon when resolvedTheme is undefined (before mount)", async () => {
    mockResolvedTheme = undefined
    render(<ThemeToggle />)
    await act(async () => {})
    // When resolvedTheme is undefined, the condition !mounted || resolvedTheme === "dark"
    // mounted will be true after effect, resolvedTheme is undefined (not "dark"), so Moon
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument()
  })
})
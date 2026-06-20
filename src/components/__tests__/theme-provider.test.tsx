import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "../theme-provider"

// Mock next-themes
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="next-themes-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}))

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <span data-testid="child">Hello</span>
      </ThemeProvider>
    )
    expect(screen.getByTestId("child")).toBeInTheDocument()
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("passes props through to NextThemesProvider", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <span>child</span>
      </ThemeProvider>
    )
    const provider = screen.getByTestId("next-themes-provider")
    const props = JSON.parse(provider.getAttribute("data-props") ?? "{}")
    expect(props.attribute).toBe("class")
    expect(props.defaultTheme).toBe("system")
    expect(props.enableSystem).toBe(true)
  })

  it("renders multiple children", () => {
    render(
      <ThemeProvider>
        <span data-testid="child-1">One</span>
        <span data-testid="child-2">Two</span>
      </ThemeProvider>
    )
    expect(screen.getByTestId("child-1")).toBeInTheDocument()
    expect(screen.getByTestId("child-2")).toBeInTheDocument()
  })

  it("wraps content in NextThemesProvider", () => {
    render(
      <ThemeProvider>
        <span>content</span>
      </ThemeProvider>
    )
    expect(screen.getByTestId("next-themes-provider")).toBeInTheDocument()
  })

  it("passes disableTransitionOnChange prop", () => {
    render(
      <ThemeProvider disableTransitionOnChange>
        <span>child</span>
      </ThemeProvider>
    )
    const provider = screen.getByTestId("next-themes-provider")
    const props = JSON.parse(provider.getAttribute("data-props") ?? "{}")
    expect(props.disableTransitionOnChange).toBe(true)
  })
})
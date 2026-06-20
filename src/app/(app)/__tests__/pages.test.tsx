import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import AccountsPage from "../accounts/page"
import CalendarPage from "../calendar/page"
import NotebookPage from "../notebook/page"
import DashboardPage from "../page"
import PlaybooksPage from "../playbooks/page"
import TradesPage from "../trades/page"

describe("AccountsPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<AccountsPage />)
    expect(container).toBeTruthy()
  })

  it("renders Coming soon text", () => {
    render(<AccountsPage />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })
})

describe("CalendarPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<CalendarPage />)
    expect(container).toBeTruthy()
  })

  it("renders Coming soon text", () => {
    render(<CalendarPage />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })
})

describe("NotebookPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<NotebookPage />)
    expect(container).toBeTruthy()
  })

  it("renders Coming soon text", () => {
    render(<NotebookPage />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })
})

describe("DashboardPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<DashboardPage />)
    expect(container).toBeTruthy()
  })

  it("renders Dashboard heading", () => {
    render(<DashboardPage />)
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument()
  })

  it("renders Coming soon text", () => {
    render(<DashboardPage />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })

  it("heading has correct styles", () => {
    render(<DashboardPage />)
    const heading = screen.getByRole("heading", { name: "Dashboard" })
    expect(heading).toHaveClass("text-2xl", "font-bold", "mb-4")
  })
})

describe("PlaybooksPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<PlaybooksPage />)
    expect(container).toBeTruthy()
  })

  it("renders Coming soon text", () => {
    render(<PlaybooksPage />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })
})

describe("TradesPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<TradesPage />)
    expect(container).toBeTruthy()
  })

  it("renders Coming soon text", () => {
    render(<TradesPage />)
    expect(screen.getByText("Coming soon")).toBeInTheDocument()
  })
})
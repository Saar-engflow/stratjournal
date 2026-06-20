import { describe, it, expect } from "vitest"
import { cn } from "../utils"

describe("cn", () => {
  it("returns empty string with no arguments", () => {
    expect(cn()).toBe("")
  })

  it("returns a single class name unchanged", () => {
    expect(cn("foo")).toBe("foo")
  })

  it("joins multiple class names with a space", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("filters out falsy values", () => {
    expect(cn("foo", false, undefined, null, "", "bar")).toBe("foo bar")
  })

  it("supports conditional classes via objects", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz")
  })

  it("supports conditional classes via arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })

  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("merges conflicting Tailwind color classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("keeps non-conflicting Tailwind classes", () => {
    const result = cn("p-2", "m-4")
    expect(result).toContain("p-2")
    expect(result).toContain("m-4")
  })

  it("handles mixed conditional and static classes", () => {
    const isActive = true
    const result = cn("base-class", isActive && "active-class")
    expect(result).toBe("base-class active-class")
  })

  it("handles mixed conditional with false condition", () => {
    const isActive = false
    const result = cn("base-class", isActive && "active-class")
    expect(result).toBe("base-class")
  })

  it("deduplicates identical class names via tailwind-merge", () => {
    // tailwind-merge deduplicates conflicting utilities; same class keeps last
    expect(cn("p-2", "p-2")).toBe("p-2")
  })

  it("handles nested arrays", () => {
    expect(cn(["foo", ["bar", "baz"]])).toBe("foo bar baz")
  })

  it("handles complex real-world usage pattern", () => {
    const isCollapsed = true
    const isActive = false
    const result = cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isCollapsed ? "justify-center" : "",
      isActive
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )
    expect(result).toContain("justify-center")
    expect(result).toContain("text-muted-foreground")
    expect(result).not.toContain("bg-accent text-accent-foreground")
  })

  it("resolves Tailwind responsive prefix conflicts", () => {
    // md:hidden and hidden are different utilities so both kept
    const result = cn("hidden", "md:flex")
    expect(result).toContain("hidden")
    expect(result).toContain("md:flex")
  })
})
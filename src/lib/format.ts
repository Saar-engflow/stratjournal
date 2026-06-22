/**
 * Formats a date for display in playbook headers and cards.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

/**
 * Formats profit/loss values with sign and two decimal places.
 */
export function formatProfitLoss(value: number): string {
  const formatted = Math.abs(value).toFixed(2)
  if (value > 0) return `+$${formatted}`
  if (value < 0) return `-$${formatted}`
  return `$${formatted}`
}

/**
 * Formats win rate as a percentage string.
 */
export function formatWinRate(winRate: number): string {
  return `${winRate.toFixed(1)}%`
}

/**
 * Truncates long description text for card previews.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

import { requireUser } from "@/lib/auth"
import { listAccountsForUser, getActiveAccountForUser } from "@/server/accounts/account.service"
import { AppLayoutClient } from "@/components/layout/app-layout-client"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await requireUser()
  const accounts = await listAccountsForUser(user.id)
  const activeAccount = await getActiveAccountForUser(user.id)

  return (
    <AppLayoutClient accounts={accounts} activeAccount={activeAccount}>
      {children}
    </AppLayoutClient>
  )
}

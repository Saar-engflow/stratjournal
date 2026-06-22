import { requireUser } from "@/lib/auth"
import { listAccountsForUser } from "@/server/accounts/account.service"
import { AccountsPageClient } from "@/features/accounts/components/accounts-page-client"

export default async function AccountsPage() {
  const user = await requireUser()
  const accounts = await listAccountsForUser(user.id)

  return (
    <AccountsPageClient
      accounts={accounts}
    />
  )
}

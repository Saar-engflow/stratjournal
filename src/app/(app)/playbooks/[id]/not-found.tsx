import Link from "next/link"

import { Button } from "@/components/ui/button"

/**
 * Not found page for invalid or unauthorized playbook routes.
 */
export default function PlaybookNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <h1 className="text-xl font-semibold">Playbook not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        This playbook does not exist or you do not have access to it.
      </p>
      <Button asChild className="mt-6">
        <Link href="/playbooks">Back to Playbooks</Link>
      </Button>
    </div>
  )
}

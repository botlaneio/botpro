import type { Metadata } from "next"

import AccountAccess from "@/components/auth/account-access"
import type { AccountMode } from "@/lib/account-form"

export const metadata: Metadata = {
  title: "Your account · Botlane",
  description: "Your Botlane account for projects, products, and billing.",
  robots: { index: false, follow: true },
}

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function Account({ searchParams }: { searchParams: Promise<{ mode?: string | string[] }> }) {
  const mode: AccountMode = one((await searchParams).mode) === "signin" ? "signin" : "signup"
  return (
    <main>
      <AccountAccess initialMode={mode} />
    </main>
  )
}

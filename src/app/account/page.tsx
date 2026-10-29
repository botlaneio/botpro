import type { Metadata } from "next"
import AccountAccess from "@/components/auth/account-access"

export const metadata: Metadata = {
  title: "Your account · Botlane",
  description: "Your Botlane account for projects, products, and billing.",
  robots: { index: false, follow: true },
}

export default function Account() {
  return <main><AccountAccess /></main>
}

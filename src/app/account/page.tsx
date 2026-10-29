import type { Metadata } from "next"
import AuthSectionThree from "@/components/ui/auth-section-3"

export const metadata: Metadata = {
  title: "Your account · Botlane",
  description: "Preview your Botlane account experience for projects, products, and billing.",
  robots: { index: false, follow: true },
}

export default function Account() {
  return <main><AuthSectionThree /></main>
}

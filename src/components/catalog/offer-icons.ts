import { Building2, Compass, FlaskConical, MessageSquareText, Rocket, ScanText, Sparkles, Store, Workflow } from "lucide-react"

import type { OfferIcon } from "@/lib/catalog"

/** The icon for each option. A plain module, so server and client components can both read it. */
export const OFFER_ICONS: Record<OfferIcon, React.ComponentType<{ className?: string }>> = {
  business: Store,
  company: Building2,
  brand: Sparkles,
  scoping: Compass,
  mvp: FlaskConical,
  full: Rocket,
  assistant: MessageSquareText,
  automation: Workflow,
  documents: ScanText,
}

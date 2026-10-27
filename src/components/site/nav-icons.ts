import { AppWindow, MessageSquareText, PanelsTopLeft, ShieldCheck } from "lucide-react"

import type { NavIcon } from "@/lib/nav"

/** The icon for each solution. A plain module, so server and client components can both read it. */
export const NAV_ICONS: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  websites: PanelsTopLeft,
  apps: AppWindow,
  care: ShieldCheck,
  assistant: MessageSquareText,
}

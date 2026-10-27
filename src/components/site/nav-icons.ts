import { AppWindow, MessageSquareText, PanelsTopLeft, ShieldCheck } from "lucide-react"

import type { NavIcon } from "@/lib/nav"

/** The icon for each solution. A plain module, so server and client components can both read it. */
export const NAV_ICONS: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  websites: PanelsTopLeft,
  apps: AppWindow,
  care: ShieldCheck,
  assistant: MessageSquareText,
}

/** Each solution's colour, for its icon: the accent for websites, then one tone each from the palette. */
export const NAV_ICON_TONES: Record<NavIcon, string> = {
  websites: "text-(--red-text)",
  apps: "text-(--ember-text)",
  care: "text-(--teal-text)",
  assistant: "text-(--violet-text)",
}

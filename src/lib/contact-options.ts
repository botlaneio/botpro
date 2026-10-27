/** The contact form's "what do you need" choices, each with the matching solution's icon and starting price. */
import type { NeedOption } from "@/components/contact/contact-form"

import { NEEDS, type NeedId } from "./contact"
import { SOLUTIONS, type NavIcon } from "./nav"

const ICON_FOR: Partial<Record<NeedId, NavIcon>> = { website: "websites", "web-app": "apps", care: "care", assistant: "assistant" }
const items = SOLUTIONS.flatMap((g) => g.items)

export const NEED_OPTIONS: NeedOption[] = NEEDS.map((n) => {
  const icon = ICON_FOR[n.id]
  return { id: n.id, label: n.label, icon, price: items.find((i) => i.icon === icon)?.price }
})

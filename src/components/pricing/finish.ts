import type { Plan } from "@/lib/pricing"

/** Plan finish to class. Written out in full so Tailwind finds and generates each one. */
export const FINISH_CLASS: Record<NonNullable<Plan["finish"]>, string> = {
  glass: "surface-glass",
  spotlight: "surface-spotlight",
  apex: "surface-apex",
}

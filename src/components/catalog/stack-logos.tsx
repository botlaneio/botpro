import { siNextdotjs, siPostgresql, siReact, siStripe, siTailwindcss, siTypescript, siVercel, type SimpleIcon } from "simple-icons"

import type { Tool, ToolId } from "@/lib/catalog"
import { cn } from "@/lib/utils"

// Logos from Simple Icons; each mark belongs to its owner.
const LOGOS: Record<ToolId, SimpleIcon> = {
  nextjs: siNextdotjs,
  react: siReact,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  vercel: siVercel,
  postgresql: siPostgresql,
  stripe: siStripe,
}

// Near-black marks would vanish on a dark tile, so they take the text colour instead of their own.
function inkFor(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18 ? "currentColor" : `#${hex}`
}

/**
 * The tools we build with, by their real logos, in the lab's finish: each a raised tile in a glass well,
 * as in the tool cluster, with its name below and, when it only sometimes applies, when. "md" is a
 * section's main content; "sm" is a compact row under something else.
 */
export function StackLogos({ tools, size = "md", className }: { tools: Tool[]; size?: "sm" | "md"; className?: string }) {
  const md = size === "md"
  return (
    <ul className={cn("flex flex-wrap", md ? "gap-x-6 gap-y-6" : "gap-x-5 gap-y-4", className)}>
      {tools.map(({ id, note }) => {
        const logo = LOGOS[id]
        return (
          <li key={id} className={cn("group/t grid justify-items-center text-center", md ? "w-24 gap-2.5" : "w-[4.75rem] gap-2")}>
            <span
              className={cn(
                "grid place-items-center rounded-[28%] border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.03))] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha))] transition-transform duration-300 ease-(--ease-lift) group-hover/t:-translate-y-0.5",
                md ? "size-[4.5rem]" : "size-14",
              )}
            >
              <span className="tile-depth grid size-[66%] place-items-center rounded-[24%]! text-foreground">
                <svg viewBox="0 0 24 24" aria-hidden className="size-[48%]">
                  <path d={logo.path} fill={inkFor(logo.hex)} />
                </svg>
              </span>
            </span>
            <span className={cn("leading-tight", md ? "text-sm" : "text-[12.5px]")}>{logo.title}</span>
            {note && <span className="label-mono -mt-1.5 text-[10px] leading-tight">{note.toUpperCase()}</span>}
          </li>
        )
      })}
    </ul>
  )
}

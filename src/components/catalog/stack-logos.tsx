import { siNextdotjs, siPostgresql, siReact, siStripe, siTailwindcss, siTypescript, siVercel, type SimpleIcon } from "simple-icons"

import type { Tool, ToolId } from "@/lib/catalog"
import { appTile } from "@/lib/app-tile"
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

/**
 * The tools we build with, by their real logos: each in a hairline tile with a faint wash of its own colour,
 * as in the tool cluster, lit on hover, with its name below and, when it only sometimes applies, when. "md" is a
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
              className={cn("tile-app rounded-[28%] [transition-property:translate,border-color,box-shadow] duration-300 ease-(--ease-lift) group-hover/t:-translate-y-0.5", md ? "size-[4.5rem]" : "size-14")}
              style={appTile(logo.hex)}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-[38%]">
                <path d={logo.path} />
              </svg>
            </span>
            <span className={cn("leading-tight", md ? "text-sm" : "text-[12.5px]")}>{logo.title}</span>
            {note && <span className="label-mono -mt-1.5 text-[10px] leading-tight">{note.toUpperCase()}</span>}
          </li>
        )
      })}
    </ul>
  )
}
